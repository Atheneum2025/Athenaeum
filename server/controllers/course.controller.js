const Course = require('../models/course.model');
const {} = require('mongoose');
const asyncWrapper = require('../middlewares/async');


const createCourse = asyncWrapper(async (req, res) => {

    const course = await Course.create(req.body)
    res.status(201).json({ course })
})

const getCourse = asyncWrapper(async (req, res) => {

    const { id: courseId } = req.params;
    console.log(courseId);
    const course = await Course.findOne({ _id: courseId });

    if (!course) {
        return res.status(404).json({ mag: `no course with id : ${courseId}` });
    }
    res.status(200).json({ course });


})

const getAllCourses =  asyncWrapper( async (req, res) => {

    const courses = await Course.find({}).populate('subjects');
    res.status(200).json({ courses: courses });

})

const deleteCourse = asyncWrapper(async (req, res) => {

    const { id: courseId } = req.params;
    const course = await Course.findOneAndDelete({ _id: courseId })
    if (!course) {
        return res.status(404).json({ mag: `no task with id : ${courseId}` })
    }
    res.status(200).json({ course });

})

const updateCourse = asyncWrapper(async (req, res) => {

    const { id: courseId } = req.params;

    const course = await Course.findOneAndUpdate({ _id: courseId }, req.body, {
        new: true,
        runValidators: true
    })

    if (!course) {
        return res.status(404).json({ mag: `no task with id : ${courseId}` })
    }
    res.status(200).json({ course })

})

module.exports = {createCourse, getCourse, getAllCourses, deleteCourse, updateCourse};