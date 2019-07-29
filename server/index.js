require("dotenv").config()
const express = require("express")
const session = require("express-session")
const massive = require("massive")

const {register,login} = require("./controllers/authCtrl")

const {SESSION_SECRET, CONNECTION_STRING, SERVER_PORT} = process.env

const app = express()

massive(CONNECTION_STRING).then(dbInstance => {
    app.set("db", dbInstance)
    console.log("database connected")
}).catch(error => console.log(error))

app.use(express.json())
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret:  SESSION_SECRET
}))

app.post("/auth/register", register)
app.post("/auth/login", login)






app.listen(SERVER_PORT, () => console.log(`listening here on ${SERVER_PORT}`))