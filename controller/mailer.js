
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
        html: `<div>
        <p>Click the button below to verify your email:</p>
        <a href="${verificationLink}" style="text-decoration: none;">
          <button style="background-color: #2563eb; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; border: none; cursor: pointer; font-size: 1rem;" onmouseover="this.style.backgroundColor='#1d4ed8'" onmouseout="this.style.backgroundColor='#2563eb'">
            Verify Email
          </button>
        </a>
      </div>
        `
    });
    console.log("An email was sent to :", email)
};



module.exports = { verify };