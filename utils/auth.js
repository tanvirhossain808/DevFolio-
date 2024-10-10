const jwt = require("jsonwebtoken")
const User = require("../model/user")

const userIsAuthenticate = async (req, res, next) => {
    try {
        const { token } = req.cookies
        if (!token) {
            throw new Error("Please login again")
        }
        const decodedObj = jwt.verify(token, process.env.JWT_TOKEN_HASH)
        const { _id } = decodedObj
        const user = await User.findById(_id)
        req.user = user
        next()
    } catch (error) {
        res.status(401).send("Error" + " " + error.message)
    }
}

module.exports = {
    userIsAuthenticate,
}
