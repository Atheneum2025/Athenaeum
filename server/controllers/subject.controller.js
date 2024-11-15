const Subject = require('../models/subject.model');
const Course = require('../models/course.model')
const {} = require('mongoose');
const asyncWrapper = require('../middlewares/async');


const createSubject = asyncWrapper(async (req, res) => {
    const { subjectname, description } = req.body;
    const {id: courseId} = req.params;
    console.log(courseId)
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    // const subjects = await Subjects.create(req.body)
    console.log(req.body)
    const newSubject = new Subject({ subjectname, description, course: courseId });
    await newSubject.save();

    // Add the subject to the course
    course.subjects.push(newSubject._id);
    await course.save();
    res.status(201).json({ newSubject })
})

const getSubject = asyncWrapper(async (req, res) => {

    const { id: subjectId } = req.params;
    const subject = await Subject.findOne({ _id: subjectId })

    if (!subject) {
        return res.status(404).json({ mag: `no subject with id : ${subjectId}` })
    }
    res.status(200).json({ subject })


})

const getAllSubjects =  asyncWrapper( async (req, res) => {

    const subjects = await Subject.find({})
    res.status(200).json({ subjects: subjects });

})

const deleteSubject = asyncWrapper(async (req, res) => {

    const { id: subjectId } = req.params;
    const subject = await Subject.findOneAndDelete({ _id: subjectId })
    if (!subject) {
        return res.status(404).json({ mag: `no subject with id : ${subjectId}` })
    }
    res.status(200).json({ subject });

})

const updateSubject = asyncWrapper(async (req, res) => {

    const { id: subjectId } = req.params;

    const subject = await Subject.findOneAndUpdate({ _id: subjectId }, req.body, {
        new: true,
        runValidators: true
    })

    if (!subject) {
        return res.status(404).json({ mag: `no subject with id : ${subjectId}` })
    }
    res.status(200).json({ subject })

})

module.exports = {createSubject, getSubject, getAllSubjects, deleteSubject, updateSubject};