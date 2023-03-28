const { Configuration, OpenAIApi } = require("openai");

async function handleSubmission(req, res) {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const userInput = req.body

    const prompt = "I am a website admin and want to evaluate students performances based on their answers. " +
                "All questions are fill in the blank. \nNetworking category:\n" +
                "FTP is __\n" +
                "SSL is __" +
                "\nProgramming category: " +
                "creator of python __\n" +
                "what is assembly __" +
                "\nBased on the students answers, generate a report that highlights which category they performed better at, and give them feedback. Keep it really short. " +
                "Answers (same order as questions above): " + userInput['networking']['question1_answer'] + ", " + userInput['networking']['question2_answer'] + ", " + userInput['programming']['question1_answer'] + ", " + userInput['programming']['question2_answer'] + "."

                console.log(prompt)
    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 2048
          });
        console.log(completion['data'])
        console.log("YES SIR")
        console.log(completion.data.choices[0].text)
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