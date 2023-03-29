const { Configuration, OpenAIApi } = require("openai");

async function handleSubmission(req, res) {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const userInput = req.body
    
    const prompt = "I am a website admin and want to evaluate students performances based on their answers. All questions are fill in the blank." +  
                // "\nNetworking category:\n" +
                // Object.keys(userInput['networking'])[0] + "\n" + Object.keys(userInput['networking'])[1] +
                "\nProgramming category:\n" +
                // Object.keys(userInput['programming'])[0] + "\n" + Object.keys(userInput['programming'])[1] +
                "1- " + Object.keys(userInput['programming'])[0] + 
                "\nDatabases category:\n" +
                // Object.keys(userInput['databases'])[0] + "\n" + Object.keys(userInput['databases'])[1] +
                "2- " + Object.keys(userInput['databases'])[0] +
                // "\nBased on the students answers, generate a report that includes success percentage in each category. Keep it really short. " +
                "\nBased on the student answer, give feedback for each question (one sentence max per question)." + 
                // "Answers (same order as questions above): " + userInput['networking']['question1_answer'] + ", " + userInput['networking']['question2_answer'] + ", " + userInput['programming']['question1_answer'] + ", " + userInput['programming']['question2_answer'] + ", " + userInput['databases']['question1_answer'] + ", " + userInput['databases']['question2_answer'] + "."
                "Answers: \n" + "1- " + userInput['programming'][Object.keys(userInput['programming'])[0]] + "\n2- " + userInput['databases'][Object.keys(userInput['databases'])[0]]

                console.log(prompt)
    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 400
          });
        console.log(completion['data'])
        return res.status(200).send({ message: completion.data.choices[0].text })
    } catch (error) {
        console.log("Unable to generate report")
        console.log(error)
        return res.status(400).send({ message: "Unable to generate report" })
    }
}

module.exports = {
    handleSubmission
}