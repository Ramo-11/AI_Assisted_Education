const express = require("express")
const route = express.Router()

const { createUser, getUsers, updateUser } = require("./UserController")
const { isLoggedIn, isLoggedOut, logUserIn, logUserOut } = require("./auth")

// *********** GET requests **********
route.get("/", (req, res) => res.render("index", { user: res.req.user }))
route.get("/practice", isLoggedIn, (req, res) => res.render("practice", { user: res.req.user }))
route.get("/signup_and_login", isLoggedOut, (req, res) => res.render("signup_and_login"))

// *********** POST requests **********
route.post("/api/signup", isLoggedOut, createUser)
route.post("/api/login", logUserIn)
route.post("/api/logout", logUserOut)

module.exports = route