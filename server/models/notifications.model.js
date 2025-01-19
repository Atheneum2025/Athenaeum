const mongoose = require("mongoose");
const Material = require("../models/material.model");

const NotificationsSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  messageBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Material",
  }
})


module.exports = mongoose.model("Notifications", NotificationsSchema);
