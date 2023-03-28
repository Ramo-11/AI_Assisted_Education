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

 async function getUsers(req, res) {
    try {
        let users = await user.find({}, { name: 1, email: 1, profilePicture: 1, _id: 1 })
        
        if (typeof req.user !== "undefined") {
            // Do not return the current logged in user in the list of users for the search field
            const userID = req.user._id
            const currentUser = await user.findById(userID)
            users = users.filter(obj => JSON.stringify(obj._id) !== JSON.stringify(currentUser._id))
        }

        console.log("List of users was retrieved successfully from the database")
        res.status(200)
        return res.json(users)
    } catch (error) {
        console.log("Unable to get list of users from database")
        console.log(error)
        return res.status(400).send({ message: "Unable to get list of users from database" })
    }
}

async function updateUser(req, res) {
    const userID = req.user._id
    const { name, email } = req.body

    if (!name) {
        console.log("Unable to update user")
        console.log("name [" + name + "] is not valid")
        return res.status(400).send({ message: "Unable to update user: name cannot be empty" })
    }

    if (!email || typeof email !== "string" || !validateEmail(email)) {
        console.log("Unable to update user")
        console.log("email [" + email + "] is not valid")
        return res.status(400).send({ message: "Unable to update user: email is invalid" })
    }

    try {
        await user.findByIdAndUpdate(userID, {
            name,
            email
        })

        console.log("user was updated successfully")
        return res.status(200).send( {message: "Success: user was updated successfully" })
    } catch (error) {
        if (error.codeName == "DuplicateKey") {
            console.log("Unable to update user")
            console.log("email [" + email + "] is already being used")
            return res.status(400).send({ message: "Unable to update user: email is already being used" })
        } else {
            console.log("Error in updating user")
            console.log(error)
            return res.status(400).send({ message: "Unable to update user" })
        }        
    }
}

module.exports = {
    createUser,
    getUsers,
    updateUser
}