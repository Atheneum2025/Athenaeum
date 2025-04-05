const mongoose = require("mongoose");
const Material = require("../models/material.model");

const NotificationsSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  messageBy: {
    type: String,
    ref: "User",
  },
  material: {
    type: String,
    ref: "Material",
  }
}, {timestamps: true})


module.exports = mongoose.model("Notifications", NotificationsSchema);
