const express = require("express")
const route = express.Router()

// *********** GET requests **********
route.get("/", (req, res) => res.render("index"))
route.get("/practice", (req, res) => res.render("practice"))

// *********** POST requests **********
module.exports = route