const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));

const devMode = process.env.NODE_ENV !== "production";

renderChatInterface = (req, res) => {
    return res.render("app", { devMode });
}

app.get("/", )