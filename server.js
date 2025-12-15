const express = require("express");
const path = require("path");
const crypto = require("crypto")

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));


const devMode = process.env.NODE_ENV !== "production";

renderChatInterface = (req, res) => {
    const placeholder_texts_array = [
            "Is it true that...",
            "Is this news true?",
            "I heard that...",
            "Did [...] really happen?",
            "Someone told me...",
        ];
        const placeholder_text = placeholder_texts_array[crypto.randomInt(placeholder_texts_array.length)];

    return res.render("app", { devMode, placeholder_text });
}

app.get("/", renderChatInterface);
app.get("/home", renderChatInterface);
app.get("/about", (req, res) => {
    return res.render("about");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    if ( devMode ){ console.log(`Debugging enabled.`); }
});