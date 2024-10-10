const express = require("express")
const bcrypt = require("bcrypt")
const User = require("../../model/user")
const isValidSignUpFields = require("../../utils/isValidSignUpFields")
const { userIsAuthenticate } = require("../../utils/auth")
const router = express.Router()

router.post("/updatepassowrd", userIsAuthenticate, async (req, res) => {
    const { password } = req.body
    try {
        const user = req.user
        if (!password) {
            throw new Error("Please fill the input")
        }
        user.password = password
        await user.validate()
        await user.save()
        res.send(password)
    } catch (error) {
        res.status(401).send("error" + " " + error.message)
    }
})

module.exports = router
