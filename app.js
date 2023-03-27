
// ********** Imports **************
const express = require("express")
const router = require("./server/router")
const bodyParser = require("body-parser")
const connectDB = require("./server/database")
// ********** End Imports **********

// ********** Initialization **************
const app = express()
require("dotenv").config()
connectDB()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static("public"))
// ********** End Initialization **********

app.use("/", router)
app.set("view engine", "ejs")
app.listen(process.env.PORT, () => console.log(`server running on port: ${process.env.PORT}`))