const Course = require("../models/course.model");
const Subject = require("../models/subject.model");
const Unit = require("../models/unit.model");
const {} = require("mongoose");
const asyncWrapper = require("../middlewares/async");

// done
const createCourse = asyncWrapper(async (req, res) => {
  
  const course = await Course.create(req.body);
  // res.status(201).json({ course });
  res
    .status(200)
    .json({ message: "Course created successfully" });
});

// done
const getCourse = asyncWrapper(async (req, res) => {
  const { courseName } = req.params;
  console.log(courseName);
  const courses = await Course.findOne({ coursename: courseName});

  if (!courses) {
    return res.status(404).json({ msg: `no course with name : ${courseName}` });
  }
  res.status(200).json({ courses });
});

// const getCourse = asyncWrapper(async (req, res) => {

//     const { courseId } = req.params;
//     console.log(courseId);
//     const course = await Course.findById(courseId);

//     if (!course) {
//         return res.status(404).json({ msg: `no course with id : ${courseId}` });
//     }
//     res.status(200).json({ course });

// })

// done
const getAllCourses = asyncWrapper(async (req, res) => {
  const courses = await Course.find({}).populate("subjects");
  res.status(200).json({ courses });
  console.log("get all courses");
});

// not complete yet
const deleteCourse = asyncWrapper(async (req, res) => {
  // when we delete a course , all the contents of the course should be deleted
  // delete subject, unit and material

  // solution
  // we will add a trigger which will delete the subject and unit after the deletion of the course
  const { courseName } = req.params;
  const course = await Course.findOneAndDelete({ coursename: courseName });
  if (!course) {
    return res.status(404).json({ msg: `no course with name : ${courseName}` });
  }

  //for deleting subjects

  res.status(200).json({ course });
});

// const deleteCourse = asyncWrapper(async (req, res) => {

// when we delete a course , all the contents of the course should be deleted
// delete subject, unit and material

// solution
// we will add a trigger which will delete the subject and unit after the deletion of the course
// const { courseId } = req.params;
// const course = await Course.findOneAndDelete({_id: courseId})
// if (!course) {
//     return res.status(404).json({ msg: `no course with id : ${courseId}` })
// }

//for deleting subjects

//     res.status(200).json({ course });

// })

const updateCourse = asyncWrapper(async (req, res) => {
  // when we update a course , all the contents of the course should be updated
  // update subject, unit and material
  const { courseName } = req.params;

  const course = await Course.findOneAndUpdate(
    { coursename: courseName },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!course) {
    return res.status(404).json({ msg: `no course with name : ${courseName}` });
  }

  res.status(200).json({ course });
});

module.exports = {
  createCourse,
  getCourse,
  getAllCourses,
  deleteCourse,
  updateCourse,
};
