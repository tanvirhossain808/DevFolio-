const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")

const { Schema } = mongoose

const userSchema = new Schema(
    {
        firstName: { type: String, required: true, min: 5, max: 50 },
        lastName: { type: String, min: 5, max: 50 },
        age: { type: Number, required: true },
        email: {
            type: String,
            required: [true, "Please add email field"],
            lowercase: true,
            unique: [true, "Email is already taken"],
            trim: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Email is not valid" + value)
                }
            },
        },
        password: {
            type: String,
            required: true,
            validate(value) {
                if (!validator.isStrongPassword(value)) {
                    throw new Error("Password is not strong" + value)
                }
            },
        },
        gender: {
            type: String,
            // enum: {
            //     values: ["male", "female", "others"],
            //     message: `${VALUE} is not a valid gender type`,
            // },
            validate(value) {
                if (!["male", "female", "others"].includes(value)) {
                    throw new Error(value + "is not a valid gender")
                }
            },
        },
        photoUrl: {
            type: String,
            default: "https://geographyandyou.com/images/user-profile.png",
            validate(value) {
                if (!validator.isURL(value)) {
                    throw new Error("Invalid Photo URL: " + value)
                }
            },
        },
        skills: {
            type: [String],
        },
    },
    {
        timestamps: true,
    }
)

userSchema.methods.getJwtToken = async function () {
    const token = await jwt.sign(
        { _id: this._id },
        process.env.JWT_TOKEN_HASH,
        {
            expiresIn: "7d",
        }
    )
    return token
}
userSchema.methods.validatePassword = async function (passByUsr) {
    const isValidPass = await bcrypt.compare(passByUsr, this.password)
    return isValidPass
}

module.exports = mongoose.model("User", userSchema)
