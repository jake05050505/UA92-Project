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
        maxAge: 1000*60*60*12, // 12 hours
        secure: false
    }
}));

const dev_mode = process.env.NODE_ENV !== "production";


//#region GET
// Condenses the GET region
const render_chat_interface = (req, res) => {
    const { chat_response } = req.session;

    const placeholder_texts_array = [
            "Is it true that...",
            "Is this news true?",
            "I heard that...",
            "Did [...] really happen?",
            "Someone told me...",
        ];
    const placeholder_text = placeholder_texts_array[crypto.randomInt(placeholder_texts_array.length)];

    if ( typeof(chat_response) !== "undefined" ){
        return res.render("app", { devMode: dev_mode, placeholderText: placeholder_text, chatResponse: chat_response });
    }

    return res.render("app", { devMode: dev_mode, placeholder_text });
}

app.get("/", render_chat_interface);
app.get("/home", render_chat_interface);
app.get("/about", (res) => { return res.render("about"); });
app.get("/clear", (req, res) => {
    delete req.session.chat_response;
    return res.redirect("/");
});
//#endregion

//#region post
app.post("/", (req, res) => {
    const chat_message = req.body.chatMessage;

    // const chat_response = client.responses.create({
    //     model: "gpt-5-nano",
    //     input: chat_message
    // })
    // .then((chat_response) => {
    //     req.session.chat_response = chat_response;
    //     return res.redirect("/");
    // }).catch(err => {
    //     console.log(err);
    //     return res.status(500).send(err.message);
    // });
    const chat_response = "TEST TESTING";

    if ( typeof(req.session.chat_response) !== "undefined" ){
        req.session.chat_response += `\n${chat_response}`;
    } else {
        req.session.chat_response = chat_response;
    }

    return res.redirect("/");
});
//#endregion

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    if ( dev_mode ){ console.log(`Debugging enabled.`); }
});