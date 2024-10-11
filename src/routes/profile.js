const express = require("express")
const { userIsAuthenticate } = require("../utils/auth")
const encryptedPassword = require("../utils/enryptedPassword")
const validator = require("validator")

const router = express.Router()

router.get("/profile/view", userIsAuthenticate, (req, res) => {
    try {
        res.json({ message: "success", user: req.user })
    } catch (error) {
        res.status(401).json({
            message: "fails",
            error: error.message,
        })
    }
})
//todo need to moved this update password or reset password in particular password reset field
router.patch("/profile/edit", userIsAuthenticate, async (req, res) => {
    try {
        const loggedInUser = req.user
        const userUpdatedInfo = req.body
        const allowedFields = ["password"]
        let canUpdate = Object.keys(userUpdatedInfo).every((key) =>
            allowedFields.includes(key)
        )
        if (!canUpdate) {
            throw new Error("Invalid action")
        }
        if (!userUpdatedInfo.password) {
            throw new Error("Please type new password")
        }

        if (await loggedInUser.validatePassword(userUpdatedInfo.password)) {
            throw new Error("Please type new password")
        }
        for (const key of Object.keys(userUpdatedInfo)) {
            if (key === "password") {
                if (!validator.isStrongPassword(userUpdatedInfo[key])) {
                    throw new Error(
                        "Password is not strong" + userUpdatedInfo[key]
                    )
                }
                const dcPass = await encryptedPassword(userUpdatedInfo[key])
                loggedInUser[key] = dcPass
            }
        }

        await loggedInUser.validate()

        await loggedInUser.save()
        res.json({
            message: "success",
            user: loggedInUser,
        })
    } catch (error) {
        res.status(401).json({
            message: "fails",
            error: error.message,
        })
    }
})

module.exports = router
