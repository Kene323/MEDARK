const express = require("express")
const db = require("./config/db")
const cors = require("cors")
const userRoutes = require("./routes/userRoutes")
const jobApplicationrouter = require("./routes/JobApplicationRoutes")
const jobRouter = require("./routes/jobRoutes")
const hospitalRouter = require("./routes/hospitalRoutes")
const profileRouter = require("./routes/profileRoutes")
const verificationRouter = require("./routes/verificationRoutes")
const adminRouter = require("./routes/adminRoute")
const hospitalProfileRouter = require("./routes/hopitalProfileRoute")
const hospitalVerificatioRouter = require("./routes/hospitalVerificationRoute")

const {PORT} = process.env
const port = PORT

const app = express()

app.use(cors({
    url:" http://localhost:5174/",
    methods:["GET", "PUT", "POST", "PATCH"],
    credentials:true
}))
db()
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/jobApplication", jobApplicationrouter);
app.use("/api/jobCreate", jobRouter);
app.use("/api/hospital", hospitalRouter);
app.use("/api/profile", profileRouter);
app.use("/api/verification", verificationRouter);
app.use("/api/adminGet", adminRouter);
app.use("/api/hospitalProfile", hospitalProfileRouter);
app.use("/api/hospitalVerification", hospitalVerificatioRouter);



app.listen(port, () => {
    console.log(new Date().toLocaleString(), port);
})