const mongoose = require("mongoose");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2")
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
    isPublished: {
      type: Boolean,
      default: "false",
    },
    views: {
      type:Number,
      default: 0,
    },
    materialURL: {
      type: String, // cloudinary url
    },
    materialP_id: {
      type: String, // public id from cloudinary
    },
    keywords: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);
MaterialSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("Material", MaterialSchema);
