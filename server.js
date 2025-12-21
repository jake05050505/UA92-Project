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
        console.log(`gpt_output = undefined`)
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
        temperature: 0.15,
        input: [
            {
                role: "system",
                content: "You are a credibility analysis agent. Your objective is to analyze a claim or answer a user\'s question. Use web search only when needed (i.e. if you don't have enough information). You should add URLs of sources which you find to \'agree\' with the user\'s claim to \'agreeing_sources\', and sources which you find to conflict with the query or claim to \'conflicting_sources\'. Try to collect atleast 5 sources total, if fewer than 5 sources are available, make a note of this in your message. Estimate how strongly the consensus agrees/disagrees with the claim in \'consensus_level\', where 0 is widely disagreed, 0.5 is 50/50, and 1 is widely agreed on - If there isn't enough information, return -1.0. For the message, provide a short summary of what you've found. Do not include citation markers, reference IDs, or source tokens in your output. Do not ask follow-up questions. Do not offer to perform additional tasks."
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