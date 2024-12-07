const mongoose = require("mongoose");
const MaterialSchema = new mongoose.Schema(
  {
    materialname: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    url: {
      type: String,
    },
    fileType: {
      type: String,
      required: false,
    },
    course: {
      type: String,
      ref: "Course",
    },
    subject: {
      type: String,
      ref: "Subject",
    },
    unit: {
      type: String,
      ref: "Unit",
    },
    owner: {
      type: String,
      ref: "User",
    },
    views: {
      type:Number,
      default: 0,
    },
    materialURL: {
      type: String, // cloudinary url
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Material", MaterialSchema);
