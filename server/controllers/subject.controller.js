const Subject = require("../models/subject.model.js");
const Course = require("../models/course.model.js");
const {} = require("mongoose");
const asyncWrapper = require("../middlewares/async.js");

// done
const createSubject = asyncWrapper(async (req, res) => {
  const user = req.user;
  console.log(user);
  // when a subject is created the corresponding course page has to be updated
  const { subjectname, description, keywords } = req.body;
  // finding the subject
  const { courseName } = req.params;
  console.log(courseName);
  const course = await Course.findOne({ coursename: courseName });
  // console.log(course)
  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  // const subjects = await Subjects.create(req.body)
  console.log(req.body);
  const newSubject = new Subject({
    subjectname,
    description,
    course: courseName,
    keywords: keywords,
  });
  await newSubject.save();

  // Add the subject to the course
  console.log(course);
  // course.subjects.push(newSubject._id);
  // await course.save();
  res.status(201).json({ newSubject });
});

// done
// not required
const getSubject = asyncWrapper(async (req, res) => {
  const { courseName, subjectName } = req.params;
  const subject = await Subject.findOne({ subjectname: subjectName });
  console.log(subject.course);
  console.log(courseName);
  if (subject.course !== courseName) {
    return res
      .status(404)
      .json({ mag: `no subject with name : ${subjectName}` });
  } else {
    res.status(200).json({ subject });
  }
});

// done
const getAllSubjects = asyncWrapper(async (req, res) => {
  const {
    page = "1",
    limit = "2",
    sortBy = "subjectname",
    SortType = "-1",
  } = req.query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const sortOrder = SortType === "1" ? 1 : -1;

  const { courseName } = req.params;
  const course = await Course.find({ coursename: courseName });

  if (!course) {
    res.status(404).json({ msg: `no course with name : ${courseName}` });
  }

  const subjects = await Subject.find({ course: courseName })
    .sort({ [sortBy]: sortOrder }) // Sorting
    .skip((pageNumber - 1) * limitNumber) // Pagination (skip previous pages)
    .limit(limitNumber);

  const totalSubjects = await Subject.countDocuments();
  res.status(200).json({
    subjects: subjects,
    totalPages: Math.ceil(totalSubjects / limitNumber),
    currentPage: pageNumber,
  });
});

const giveAllsubjects = asyncWrapper(async (req, res) => {
  const subjects = await Subject.find({});
  res.status(200).json({ subjects });
  console.log("get all subjects");
});

const deleteSubject = asyncWrapper(async (req, res) => {
  // when we delete a subject , all the contents of the subject should be deleted
  // delete unit and material

  // solution
  // we will add a trigger which will delete the unit after the deletion of the subject

  // and update the course collection which has this subject in its array of subject
  const { courseName, subjectName } = req.params;

  console.log(courseName);
  const course = await Course.find({ coursename: courseName });

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  const subject = await Subject.findOneAndDelete({ subjectname: subjectName });
  if (!subject) {
    return res.status(404).json({ mag: `no subject with id : ${subjectName}` });
  }
  res.status(200).json({ message: "Subject deleted successfully", course });
});

const updateSubject = asyncWrapper(async (req, res) => {
  // when we update a subject , all the contents of the subject should be updated
  // update course, unit and material

  const { subjectName } = req.params;

  const subject = await Subject.findOneAndUpdate(
    { subjectname: subjectName },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!subject) {
    return res.status(404).json({ msg: `no subject with id : ${subjectId}` });
  }
  res.status(200).json({ subject });
});

module.exports = {
  createSubject,
  getSubject,
  getAllSubjects,
  deleteSubject,
  updateSubject,
  giveAllsubjects,
};
