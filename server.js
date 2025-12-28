const express = require("express");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");
const path = require("path");
const session = require("express-session");
const crypto = require("crypto");

dotenv.config();
let client;
const NO_API_KEY = typeof process.env.OPENAI_API_KEY === "undefined";
if (NO_API_KEY){
    console.log("No API key was found, this will prevent the chat interface from working.");
} else {
    client = new OpenAI();
}
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));
app.use(session({
    secret: "session-secret",
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 12, // 12 hours
        secure: false
    }
}));

const dev_mode = process.env.NODE_ENV === "development";

//#region GET
app.get("/", (req, res) => {
    console.log("Incoming GET request on \'/\'");

    const placeholder_texts_array = [
        "Is it true that...",
        "Is this true?",
        "I heard that...",
        "Did [...] really happen?",
        "Someone told me that...",
    ];
    const placeholder_text = placeholder_texts_array[crypto.randomInt(placeholder_texts_array.length)];

    const { gpt_message, gpt_statistics } = req.session;
    if (typeof gpt_message !== "undefined" && typeof gpt_statistics !== "undefined") {
        return res.render("app", { NO_API_KEY, dev_mode, placeholder_text, message: gpt_message, statistics: gpt_statistics });
    }
    else {
        return res.render("app", { NO_API_KEY, dev_mode, placeholder_text });
    }
});
app.get("/home", ({ res }) => { return res.redirect("/"); });
app.get("/about", ({ res }) => { console.log("Incoming GET request on \'/about\'"); return res.render("about"); });
app.get("/clear", (req, res) => {
    delete req.session.gpt_message;
    delete req.session.gpt_statistics;
    return res.redirect("/");
});
//#endregion

//#region post
app.post("/", (req, res) => {
    console.log("Incoming POST request on \'/\'");

    const user_query = req.body.chat_message;

    if (dev_mode){ console.log(user_query.split(' '), user_query.split(' ').length); }

    if (user_query.length > 300) {
        return res.render("app", { error: "Your previous input was too long." });
    } else if (user_query.length < 2){
        return res.render("app", { error: "Please provide a suitable input." });
    }

    const gpt_response = client.responses.create({
        model: "gpt-5-mini",
        tools: [
            { type: "web_search", }
        ],
        input: [ // ChatGPT was used to help refine system prompt.
            {
                role: "system",
                content: `You are a credibility analysis engine.

                Your objective is to analyze a claim or answer a question from both a supportive and critical perspective.

                Return:
                - message: A concise summary of the findings. For opinions or disputed points, state the claim and how many sources support it.
                - statistics.agreeing_sources: A list of URLs of sources which support a claim a user has made, or which help answer a question.
                - statistics.conflicting_sources: A list of URLs of sources which conflict with a claim the user has made.
                - statistics.consensus_level: A number, to two decimal places, representing the proportion of sources that support the claim.
                    - 0 means heavy disagreement.
                    - 0.5 means mixed opinions.
                    - 1 means widely agreed on.
                    - If there isn't enough information, return -1.0.

                Rules:
                - Treat statements as unproven claims. Do not assume them to be true; Analyze and report consensus accordingly.
                - Collect atleast 10 sources. If fewer than 10 sources are available, note this in the message.
                - When calculating the consensus_level, weigh each source according to how credible/trust-worthy the source's website is.
                - Do not include citation markers, reference IDs, or source tokens in your output.
                - Remove all internal reference tokens. Only include human-readable summaries and URLs.
                - Do not ask follow-up questions.
                - Do not offer to perform additional tasks.
                - Do not provide instructions to verify information; Provide the verified information yourself if possible.
                - Some queries may be offensive, in your message, you should discourage this kind of behaviour.`
            },
            {
                role: "user",
                content: user_query
            }
        ],
        text: {
            format: {
                type: "json_schema",
                name: "gpt_response",
                schema: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        message: { type: "string" },
                        statistics: {
                            type: "object",
                            additionalProperties: false,
                            properties: {
                                agreeing_sources: { type: "array", items: { type: "string"} },
                                conflicting_sources: { type: "array", items: { type: "string"} },
                                consensus_level: {
                                    type: "number",
                                }
                            },
                            required: [
                                "agreeing_sources",
                                "conflicting_sources",
                                "consensus_level"
                            ]
                        }
                    },
                    required: ["message", "statistics"]
                }
            }
        }
    }).then(gpt_response => {
        req.session.loading
        if (dev_mode){ console.log(gpt_response); }

        gpt_response = JSON.parse(gpt_response.output_text);
        req.session.gpt_message = gpt_response.message;
        req.session.gpt_statistics = gpt_response.statistics;

        return res.redirect("/");
    }).catch(err => {
        console.log(err);
        return res.status(500).send(err.message);
    });
});
//#endregion

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    if (dev_mode) { console.log(`Debugging enabled.`); }
});