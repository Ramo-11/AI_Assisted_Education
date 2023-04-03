const { Configuration, OpenAIApi } = require("openai");
const quiz = require("../models/quiz")

async function handleSubmission(req, res) {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const userInput = req.body
    const userId = req.user._id;
     
    const prompt = "Evaluate the following answers for each question:" +  
                "\nNetworking question:\n" + "1- " + Object.keys(userInput['networking'])[0] + "\nAnswer: " + userInput['networking'][Object.keys(userInput['networking'])[0]] +
                "\nProgramming quuestion:\n" + "2- " + Object.keys(userInput['programming'])[0] + "\nAnswer: " + userInput['programming'][Object.keys(userInput['programming'])[0]] +
                "\nDatabases quuestion:\n" + "3- " + Object.keys(userInput['databases'])[0] + "\nAnswer: " + userInput['databases'][Object.keys(userInput['databases'])[0]] +
                "\nFor each question, provide feedback indicating whether the answer is correct or not, and give the correct answer if it is not correct." + 
                "\nAdditionaly, generate one new question per category." +
                "\nYour response MUST be in the following format:" + 
                "\nFeedback 1: your feedback" +
                "\nFeedback 2: your feedback" +
                "\nFeedback 3: your feedback" +
                "\nNetworking: new networking question" +
                "\nProgramming: new programming question" +
                "\nDatabases: new databases question" +
                "\nyou must follow this format. Feedback must start with the word Correct or Incorrect, don't use colons in your answer"

    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 2000
          });
        console.log(completion['data'])

        const ai_text = completion.data.choices[0].text
        const output = {}
        const feedbackRegex = /Feedback (\d+):\s*(.*)/gi
        let match
        while ((match = feedbackRegex.exec(ai_text)) !== null) {
            const index = parseInt(match[1])
            const value = match[2]
            output[`Feedback ${index}`] = value
        }

        const newQuestionRegex = /(.*):\s*(.*)/gi
        while ((match = newQuestionRegex.exec(ai_text)) !== null) {
            const category = match[1]
            const question = match[2]
            output[category] = question
        }

        console.log(output)

        const questiosn = [
            Object.keys(userInput['networking'])[0],
            Object.keys(userInput['programming'])[0],
            Object.keys(userInput['databases'])[0]
        ]
        const answers = [
            userInput['networking'][Object.keys(userInput['networking'])[0]],
            userInput['programming'][Object.keys(userInput['programming'])[0]],
            userInput['databases'][Object.keys(userInput['databases'])[0]]
        ]
        const correctness = [
            output['Feedback 1'].includes("Correct") ? true : false,
            output['Feedback 2'].includes("Correct") ? true : false,
            output['Feedback 3'].includes("Correct") ? true : false
        ]

        createQuiz(userId, questiosn, answers, correctness)

        return res.status(200).send({ message: output })
    } catch (error) {
        console.log("Unable to generate report")
        console.log(error)
        return res.status(400).send({ message: "Error parsing AI response: " + completion.data.choices[0].text })
    }
}

async function createQuiz(userId, questions, answers, correctness) {
    try {
        await quiz.create({
            user: userId,
            networking: {
                q: questions[0],
                q_answer: answers[0],
                q_correct: correctness[0]
            },
            programming: {
                q: questions[1],
                q_answer: answers[1],
                q_correct: correctness[1]
            },
            databases: {
                q: questions[2],
                q_answer: answers[2],
                q_correct: correctness[2]
            }
          });
        console.log("Quiz was created successfully")
    } catch (error) {
        console.log("unable to create quiz")
        console.log(error)
    } finally {
        return
    }
}

module.exports = {
    handleSubmission
}