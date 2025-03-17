const mongoose = require("mongoose");
const User = require("../models/user.model.js")

const ContactUsSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    sender: {
        type: String,
        ref: "User",
    },
    receiver: {
        type: String,
        ref: "User",
    },
});

module.exports = mongoose.model("ContactUs", ContactUsSchema);