const express = require("express")
const route = express.Router()

const { createUser } = require("./UserController")
const { handleSubmission } = require("./openai_api")
const { isLoggedIn, isLoggedOut, logUserIn, logUserOut } = require("./auth")
const { getUserQuizzes } = require("./quiz")

// *********** GET requests **********
route.get("/signup_and_login", isLoggedOut, (req, res) => res.render("signup_and_login"))
route.get("/", (req, res) => res.render("index", { user: res.req.user }))
route.get("/practice", isLoggedIn, (req, res) => res.render("practice", { user: res.req.user }))
route.get("/reports", isLoggedIn, (req, res) => res.render("reports", { user: res.req.user }))
route.get("/api/getUserQuizzes/:email", isLoggedIn, getUserQuizzes)

// *********** POST requests **********
route.post("/api/signup", isLoggedOut, createUser)
route.post("/api/login", logUserIn)
route.post("/api/logout", logUserOut)
route.post("/api/submitQuiz", isLoggedIn, handleSubmission)

module.exports = route