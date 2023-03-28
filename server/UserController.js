const user = require("../models/user")
const bcrypt = require("bcryptjs");
const { validateEmail, verifyPassword } = require("../utils/authentication")


// create new user
async function createUser (req, res) {
    const { name, email, password: plainTextPassword } = req.body

    // verify that all fields entered by user are valid
    if (!name) {
        console.log("Unable to create user")
        console.log("name [" + name + "] is not valid")
        return res.status(400).send({ message: "Name cannot be empty" })
    }
    if (!email || typeof email !== "string" || !validateEmail(email)) {
        console.log("Unable to create user")
        console.log("email [" + email + "] is not valid")
        return res.status(400).send({ message: "Invalid email" })
    }
    passwordCheck = verifyPassword(plainTextPassword)
    if (passwordCheck !== "password is good") {
        console.log("Unable to create user")
        console.log("password [" + plainTextPassword + "] is not valid")
        return res.status(400).send({ message: passwordCheck })
    }
    
    // encrypt the password
    const password = await bcrypt.hash(plainTextPassword, 10)

    try {
        await user.create({
            name,
            email,
            password
        }) 
        console.log("user with name [" + name + "] was created successfully")
        return res.status(200).send({ message: "User was created successfully" })
    } catch (error) {
        if (error.code === 11000) {
            console.log("unable to register user: email already exists")
            console.log(error)
            return res.status(400).send({ message: "Unable to create user: email already exists" })
        }
        else {
            console.log("unable to register user")
            console.log(error)
            return res.status(400).send({ message: "Unable to create user" })
        }
    }
}

module.exports = {
    createUser  
}