const mongoose = require('mongoose');
const Unit = require('../models/unit.model');
const Material = require('../models/material.model');
const SubjectSchema = new mongoose.Schema(
  {
    subjectname: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: false,
    },
    course: {
      type: String,
      ref: "Course",
    },
    units: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Unit",
      },
    ],
    keywords: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

SubjectSchema.pre('findOneAndDelete', async function (next) {
    const subjectId = this.getQuery().subjectname;
    console.log(subjectId)
    await Unit.deleteMany({ subject: subjectId });
    console.log(`Deleted all subjects related to course ID: ${subjectId}`)
    next();
})

SubjectSchema.pre('findOneAndUpdate', async function (next) {
    const subjectId = this.getQuery().subjectname;
    const updateData = this.getUpdate(); // Get the update data (e.g., coursename, description)

    const newSubjectName = updateData.subjectname;
    console.log(subjectId);
    await Unit.updateMany({ subject: subjectId }, { $set: { subject: newSubjectName } })
    await Material.updateMany({subject: subjectId}, { $set: {subject: newSubjectName}});

    next();
})

module.exports = mongoose.model('Subject', SubjectSchema);
