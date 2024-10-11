const express = require("express")
const bcrypt = require("bcrypt")
const User = require("../model/user")
const isValidSignUpFields = require("../utils/isValidSignUpFields")
const { userIsAuthenticate } = require("../utils/auth")
const validator = require("validator")
const encryptedPassword = require("../utils/enryptedPassword")
const router = express.Router()

router.post("/signin", async (req, res) => {
    const { password, email, ...rest } = req.body
    const userInputFields = { password, email, ...rest }
    try {
        const inputFieldsKeys = Object.keys(userInputFields)
        if (
            inputFieldsKeys.length <= 0 ||
            inputFieldsKeys.length < 4 ||
            inputFieldsKeys.length > 6 ||
            !isValidSignUpFields(
                ["firstName", "lastName", "age", "email", "password", "gender"],
                inputFieldsKeys
            )
        ) {
            throw new Error("Invalid input fields")
        }
        const isUserInDb = await User.findOne({ email })

        if (isUserInDb) {
            throw new Error("Invalid credential")
        }

        if (!validator.isStrongPassword(password)) {
            throw new Error("Password is not strong" + " " + password)
        }

        const hasPassword = await encryptedPassword(password)
        const user = new User({ ...rest, password: hasPassword, email })
        const savedUser = await user.save()
        res.send(savedUser)
    } catch (error) {
        res.status(400).send("Sing in error" + " " + error)
    }
})

router.post("/login", async (req, res, next) => {
    const { password, email } = req.body
    try {
        if (!password || !email) {
            throw new Error("Please fill all the input")
        }

        const user = await User.findOne({ email })
        if (!user) {
            throw new Error("Invalid credential")
        }
        const isValidPass = await user.validatePassword(password)
        if (!isValidPass) {
            throw new Error("Invalid credentials")
        }
        const token = await user.getJwtToken()

        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 36000000),
        })
        res.json({ message: "success" })
    } catch (error) {
        res.status(400).send("Credential error" + " " + error.message)
    }
})
router.post("/profile", userIsAuthenticate, (req, res) => {
    try {
        res.send(req.user)
    } catch (error) {
        throw new Error("Credential error" + error.message)
    }
})

router.post("/logout", (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    })
    res.json({ message: "Log out successfully" })
})

module.exports = router
