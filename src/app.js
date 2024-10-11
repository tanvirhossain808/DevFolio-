const express = require("express")
const authRoute = require("./routes/auth")
const editRoute = require("./routes/editRoute")
const profileRoute = require("./routes/profile")
const dbConnect = require("./config/db")
const { userIsAuthenticate } = require("./utils/auth")
const cookieParser = require("cookie-parser")
const app = express()
app.use(express.json())
app.use(cookieParser())
require("dotenv").config()

app.use("/", authRoute)
app.use("/", editRoute)
app.use("/", profileRoute)

app.post("/logins", userIsAuthenticate, async (req, res) => {
    res.send(req.user)
})
app.get("/", (req, res) => {
    res.json({
        message: "success",
    })
})

dbConnect()
    .then(() => {
        console.log("dbConnect")
        app.listen(8000, () => {
            console.log("listening the port 8000")
        })
    })
    .catch((err) => {
        console.log(err)
    })
