const mongoose = require("mongoose")

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected successfully`)
    } catch(error) {
        console.log("unable to connect to database: are you sure the IP address is whitelisted in the database?\n")
        console.log(error)
    }
}

module.exports = connectDB