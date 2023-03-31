const quiz = require("../models/quiz")
const user = require("../models/user")

async function getUserQuizzes(req, res) {
    try {
        const userEmail = req.params.email
        console.log(userEmail)
        const user_ = await user.findOne({ email: userEmail })
        
        const quizzes = await quiz.find({ user: user_._id }, { author: 0 })

        console.log("quizzes were retrieved successfully")
        return res.status(200).json({ message: quizzes });
    } catch (error) {
        console.log("Unable to retrieve projects")
        console.log(error)
        return res.status(400).send({ message: "Unable to retrieve quizzes for this user" })
    }
}

module.exports =  {
    getUserQuizzes
}