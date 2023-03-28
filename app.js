
// ********** Imports **************
const express = require("express")
const session = require("express-session")
const app = express()
const router = require("./server/router")
const bodyParser = require("body-parser")
const connectDB = require("./server/database")
const MongoStore = require("connect-mongo")
const passport = require("passport")
// ********** End Imports **********

// ********** Initialization **************
require("./server/auth")
require("dotenv").config()
connectDB()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static("public"))
app.use(session({
    secret: "kljasoiuj3io43@$3klnklv4515451$232s:",
    cookie: { maxAge: 86400000 }, // 24 hours
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}))

app.use(passport.initialize())
app.use(passport.session())
// ********** End Initialization **********

app.use("/", router)
app.set("view engine", "ejs")
app.listen(process.env.PORT, () => console.log(`server running on port: ${process.env.PORT}`))