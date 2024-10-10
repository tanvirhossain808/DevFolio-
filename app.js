const express = require("express")
const authRouter = require("./routes/auth/auth")
const editRoute = require("./routes/edit/editRoute")
const dbConnect = require("./config/db")
const { userIsAuthenticate } = require("./utils/auth")
const cookieParser = require("cookie-parser")
const app = express()
app.use(express.json())
app.use(cookieParser())
require("dotenv").config()

// app.post("/user", async (req, res) => {
//     try {
//         await new User({
//             firstName: "String",
//             lastName: "String",
//             age: 5,
//             email: "String",
//             gender: "String",
//             password: "String",
//         }).save()
//         res.send("user added successfully")
//     } catch (error) {
//         res.status(400).send("failed to add user")
//     }
// })

app.use("/", authRouter)
app.use("/", editRoute)

app.post("/logins", userIsAuthenticate, async (req, res) => {
    res.send(req.user)
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
