const mongoose = require("mongoose");
const Subject = require("../models/subject.model");
const Unit = require("../models/unit.model");
const Material = require("../models/material.model");
const CourseSchema = new mongoose.Schema(
  {
    coursename: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
    keywords: {
      type: String,
    },
    acronym:{
      type: String
    }
  },
  {
    timestamps: true,
  }
);

CourseSchema.pre("findOneAndDelete", async function (next) {
  const courseId = this.getQuery()._id;
  console.log(courseId);
  await Subject.deleteMany({ course: courseId });
  await Unit.deleteMany({ course: courseId });
  console.log(`Deleted all subjects related to course ID: ${courseId}`);
  next();
});

CourseSchema.pre("findOneAndUpdate", async function (next) {
  const courseId = this.getQuery().coursename;
  const updateData = this.getUpdate(); // Get the update data (e.g., coursename, description)

  const newCourseName = updateData.coursename;
  console.log(courseId);
  await Subject.updateMany(
    { course: courseId },
    { $set: { course: newCourseName } }
  );
  await Unit.updateMany(
    { course: courseId },
    { $set: { course: newCourseName } }
  );
  await Material.updateMany(
    { course: courseId },
    { $set: { course: newCourseName } }
  );
  next();
});
module.exports = mongoose.model("Course", CourseSchema);
