
const nodemailer = require("nodemailer");
require("dotenv/config");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    }
});


async function verify(email, token) {
    const verificationLink = `http://localhost:5173/api/verify/${token}`

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify your email",
        html: `<p>Click the link below to verify your email: grace email</p>
        ${verificationLink}`
    });
    console.log("An email was sent to :", email)
};



module.exports = { verify };