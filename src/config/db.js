const mongoose = require("mongoose")

const connectDb = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://tanvirhossan528:${process.env.MONGO_PASS}@cluster0.bllbd.mongodb.net/devtender`
        )
    } catch (error) {
        throw new Error("DB not connected")
    }
}

module.exports = connectDb
