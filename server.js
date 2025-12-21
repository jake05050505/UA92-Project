const express = require("express");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");
const path = require("path");
const session = require("express-session");
const crypto = require("crypto");

dotenv.config();
const client = new OpenAI();
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

const dev_mode = process.env.NODE_ENV !== "production";


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

    const { gpt_output } = req.session;
    if (typeof gpt_output !== "undefined") {
        const { message, statistics } = gpt_output;
        return res.render("app", { dev_mode, placeholder_text, message, statistics });
    }
    else {
        return res.render("app", { dev_mode, placeholder_text });
    }
});
app.get("/home", ({ res }) => { return res.redirect("/"); });
app.get("/about", ({ res }) => { console.log("Incoming GET request on \'/about\'"); return res.render("about"); });
app.get("/clear", (req, res) => {
    delete req.session.chat_response;
    return res.redirect("/");
});
//#endregion

//#region post
app.post("/", (req, res) => {
    const user_query = req.body.chatMessage;

    console.log("Incoming POST request on \'/\'")

    console.log(user_query.split(' '), user_query.split(' ').length)

    if (user_query.length > 300) {
        return res.render("app", { placeholderText: "Your previous input was too long." });
    } else if (user_query.length < 2){
        return res.render("app", { placeholderText: "Please provide a suitable input." });
    }

    const gpt_response = client.responses.create({
        model: "gpt-5-mini",
        tools: [
            { type: "web_search", }
        ],
        input: [
            {
                role: "system",
                content: `You are a credibility analysis engine.

                Your objective is to analyze a claim or answer a question from both a supportive and critical perspective.

                Return:
                - message: A concise summary of the findings. For opinions or disputed points, state the claim and how many sources support it.
                - statistics.agreeing_sources: A list of URLs of sources which support a claim a user has made, or which help answer a question.
                - statistics.conflicting_sources: A list of URLs of sources which conflict with a claim the user has made.
                - statistics.consensus_level: A number representing the proportion of sources that support the claim.
                    - 0 means heavy disagreement.
                    - 0.5 means mixed opinions.
                    - 1 means widely agreed on.
                    - If there isn't enough information, return -1.0.

                Rules:
                - Treat statements as unproven claims. Do not assume them to be true; Analyze and report consensus accordingly.
                - Only use web search when you don't have enough information, and when the information is likely to be available online.
                - Collect atleast 5 sources which agree, and 5 sources which disagree. If fewer than 5 sources are available, note this in the message.
                - Do not include citation markers, reference IDs, or source tokens in your output.
                - Remove all internal reference tokens. Only include human-readable summaries and URLs.
                - Do not ask follow-up questions.
                - Do not offer to perform additional tasks.
                - Do not provide instructions to verify information; Provide the verified information yourself if possible.`
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
    })
    .then((gpt_response) => {
        console.log(gpt_response)
        req.session.gpt_output = JSON.parse(gpt_response.output_text);
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