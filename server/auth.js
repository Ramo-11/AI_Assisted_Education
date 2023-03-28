const passport = require("passport")
const { Strategy } = require("passport-local")
const User = require("../models/user")
const bcrypt = require("bcryptjs");

passport.serializeUser((user, done) => done(null, user._id))
passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id)
        if(!user)
            throw new Error("user was not found")
        return done(null, user)
    } catch(error) {
        console.log("unable to deserialize user")
        console.log(error)
        return done(error, null)
    }
})

passport.use(
    new Strategy({
        usernameField: "email"
    }, async function (email, password, done) {
        try {
            if(email && password) {
                const user = await User.findOne({ email }).lean()
                if(!user)
                    throw new Error("User was not found with the given email")
                if(await bcrypt.compare(password, user.password)) {
                    console.log("user with email [" + email + "] logged in successfully")
                    return done(null, user)
                }
                else 
                    throw new Error("Password is incorrect")
            }
            else
                throw new Error("Email and password must not be empty")
        } catch (error) {
            console.log("Unable to log user in")
            console.log(error)
            return done(null, false, { message: error.message })
        }
    })
)

function logUserIn(req, res, next) {
    passport.authenticate("local", function(error, user, info) {
        if (error) {
            console.log("Unable to log user in")
            console.log(error)
            return next(error) // will generate a 500 error
        }
            // usually this means missing credentials
        if (!user) {
            console.log("Unable to log user in")
            console.log(info.message)
            return res.status(400).send({ message: info.message })
        }
        req.login(user, loginErr => {
            if (loginErr)
                return next(loginErr)
            return res.status(200).send({ message: "User was logged in successfully" })
        }) 
    }) (req, res, next)
}

function logUserOut(req, res) {
    req.logout(function(error) {
        if (error) {
            console.log("Unable to log user out")
            console.log(error)
            return next(error)
        }
        console.log("user has been logged out")
        return res.redirect("/signup_and_login")
    })
}

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    return res.redirect("/signup_and_login")
}

function isLoggedOut(req, res, next) {
    if(!req.isAuthenticated()) {
        return next()
    }
    return res.redirect("/")
}

module.exports = {
    isLoggedIn,
    isLoggedOut,
    logUserIn,
    logUserOut
}