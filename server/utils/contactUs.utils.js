const asyncWrapper = require("../middlewares/async.js")
const nodemailer = require("nodemailer");

const sendMessageToAdmin = asyncWrapper( async (req, res) => {

    const {name, email, message} = req.body;

    if(!name || !email || !message){
        return res.status(400).json({message: "All fields are required"});
    }
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // Gmail SMTP server
        port: 587,             // Standard port
        secure: false,
        auth: {
            user: process.env.GMAIL_ACCOUNT,
            pass: process.env.GMAIL_PASSWORD
        }
    })

    const mailOptions ={
        from: email,
        to: "rishonfernandes@gmail.com",
        subject: `Contact Form Submission from ${name}`,
        text: `You have a new message from ${name} (${email}):\n\n${message}`
    }

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: "Message sent successfully!" });
})

module.exports = {
    sendMessageToAdmin
}