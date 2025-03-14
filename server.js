const express = require("express")
const db = require("./config/db")


const {PORT} = process.env
const port = PORT

const app = express()
db()

app.use(express.json())

app.listen(port, () => {
    console.log(new Date().toLocaleString(), port);
})