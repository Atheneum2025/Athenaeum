const mongoose = require("mongoose");
const Material = require("../models/material.model");

const NotificationsSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  reply: {
    type: String,
  },
  messageBy: {
    type: String,
    ref: "User",
  },
  material: {
    type: String,
    ref: "Material",
  }
})


module.exports = mongoose.model("Notifications", NotificationsSchema);
