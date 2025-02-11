const nodemailer = require("nodemailer");

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services like Outlook, Yahoo, etc.
  auth: {
    user: "rishonfernandes89@gmail.com", // Replace with your email
    pass: "carmam1904", // Replace with your email app password
  },
});

// Function to send an email
const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: '"Your Name" <your-email@gmail.com>', // Sender name & email
      to, // Receiver email
      subject, // Email subject
      text, // Plain text message
      html: `<p>${text}</p>`, // HTML version (optional)
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Call the function
sendEmail(
  "rishonfernandes89@gmail.com",
  "Test Email",
  "Hello! This is a test email from Node.js."
);
