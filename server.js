const express = require("express");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");
const crypto = require("crypto");
const path = require("path");

dotenv.config();
const client = new OpenAI();
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));

const dev_mode = process.env.NODE_ENV !== "production";

// Condenses the GET region
const render_chat_interface = (req, res) => {
    const placeholder_texts_array = [
            "Is it true that...",
            "Is this news true?",
            "I heard that...",
            "Did [...] really happen?",
            "Someone told me...",
        ];
        const placeholder_text = placeholder_texts_array[crypto.randomInt(placeholder_texts_array.length)];

    return res.render("app", { devMode: dev_mode, placeholder_text });
}

//#region GET
app.get("/", render_chat_interface);
app.get("/home", render_chat_interface);
app.get("/about", (req, res) => {
    return res.render("about");
});
//#endregion
//#region post
app.post("/", (req, res) => {
    const chat_message = req.body.chatMessage;

    const chat_response = client.responses.create({
        model: "gpt-5-nano",
        input: chat_message
    }).then((chat_response) => {
        console.log(chat_response);
        return res.render("app", { chatResponse: chat_response });
    }).catch(err => {
        return res.status(500).send(err.message);
    });
});
//#endregion

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    if ( dev_mode ){ console.log(`Debugging enabled.`) }
});