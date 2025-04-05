const Course = require("../models/course.model");
const Subject = require("../models/subject.model");
const Unit = require("../models/unit.model");
const {} = require("mongoose");
const asyncWrapper = require("../middlewares/async");

// done
const createCourse = asyncWrapper(async (req, res) => {
    const course = await Course.create(req.body);
    // res.status(201).json({ course });
    res.status(200).json({ message: "Course created successfully" });
});

// done
const getCourse = asyncWrapper(async (req, res) => {
    const { courseName } = req.params;
    const courses = await Course.findOne({ coursename: courseName });

    if (!courses) {
        return res
            .status(404)
            .json({ msg: `no course with name : ${courseName}` });
    }
    res.status(200).json({ courses });
});

// const getCourse = asyncWrapper(async (req, res) => {

//     const { courseId } = req.params;
//     const course = await Course.findById(courseId);

//     if (!course) {
//         return res.status(404).json({ msg: `no course with id : ${courseId}` });
//     }
//     res.status(200).json({ course });

// })

// done
const getAllCourses = asyncWrapper(async (req, res) => {
    const {
        page = "1",
        limit = "2",
        sortBy = "coursename",
        SortType = "-1",
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const sortOrder = SortType === "1" ? 1 : -1;

    const courses = await Course.find({})
        .sort({ [sortBy]: sortOrder })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

    const totalCourses = await Course.countDocuments();
    res.status(200).json({
        courses,
        totalPages: Math.ceil(totalCourses / limitNumber),
        currentPage: pageNumber,
    });
});

const giveAllCourses = asyncWrapper(async (req, res) => {
    const courses = await Course.find({});
    res.status(200).json({ courses });
});
// not complete yet
const deleteCourse = asyncWrapper(async (req, res) => {
    // when we delete a course , all the contents of the course should be deleted
    // delete subject, unit and material

    // solution
    // we will add a trigger which will delete the subject and unit after the deletion of the course
    // const {role} = req.user.role
    // console.log(role)
    const { courseName } = req.params;
    const course = await Course.findOneAndDelete({ coursename: courseName });
    if (!course) {
        return res
            .status(404)
            .json({ msg: `no course with name : ${courseName}` });
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
        {
            $set: {
                coursename: req.body.editCoursename,
                description: req.body.editCoursedescription,
                keywords: req.body.editCourseKeywords,
            },
        },
        {
            new: true,
            runValidators: true,
        }
    );
    if (!course) {
        return res
            .status(404)
            .json({ msg: `no course with name : ${courseName}` });
    }

    res.status(200).json({ course });
});

const getCoursesHighestRatings = asyncWrapper( async (req, res) => {
    const topFourCourses = await Course.find().sort({rating: -1}).limit(4);

    res.status(200).json({topFourCourses});
})


module.exports = {
    createCourse,
    getCourse,
    getAllCourses,
    giveAllCourses,
    deleteCourse,
    updateCourse,
    getCoursesHighestRatings,
};
