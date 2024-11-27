const Subject = require('../models/subject.model');
const Course = require('../models/course.model')
const { } = require('mongoose');
const asyncWrapper = require('../middlewares/async');

// done
const createSubject = asyncWrapper(async (req, res) => {

    // when a subject is created the corresponding course page has to be updated
    const { subjectname, description } = req.body;
    // finding the subject
    const { courseName } = req.params;
    const course = await Course.findOne({ coursename: courseName });
    // console.log(course)
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }

    // const subjects = await Subjects.create(req.body)
    console.log(req.body)
    const newSubject = new Subject({ subjectname, description, course: courseName });
    await newSubject.save();
    
    // Add the subject to the course
    console.log(course)
    // course.subjects.push(newSubject._id);
    // await course.save();
    res.status(201).json({ newSubject })
})

// done 
// not required
const getSubject = asyncWrapper(async (req, res) => {

    const { courseName, subjectName } = req.params;
    const subject = await Subject.findOne({ subjectname: subjectName })
    console.log(subject)
    console.log(courseName)
    if (subject.course !== courseName) {
        return res.status(404).json({ mag: `no subject with name : ${subjectName}` })
    }
    else {
        res.status(200).json({ subject })
    }

})

// done
const getAllSubjects = asyncWrapper(async (req, res) => {

    const { courseName } = req.params;
    const course = await Course.find({coursename: courseName})
     
    if(!course){
        res.status(404).json({msg:`no course with name : ${courseName}`})
    }
    
    else{
        const subjects = await Subject.find({ course: courseName });
        res.status(200).json({ subjects: subjects });

    }

})

const deleteSubject = asyncWrapper(async (req, res) => {

    // when we delete a subject , all the contents of the subject should be deleted
    // delete unit and material

    // solution
    // we will add a trigger which will delete the unit after the deletion of the subject

    // and update the course collection which has this subject in its array of subject
    const { courseName, subjectName } = req.params;

    console.log(courseName);
    const course = await Course.find({coursename:courseName});

    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }

    // Find the subject index in the subjects array
    // const subjectIndex = course.subjects.findIndex(
    //     (subject) => subject._id.toString() === subjectId
    // );

    // if (subjectIndex === -1) {
    //     return res.status(404).json({ error: 'Subject not found in course' });
    // }

    // // Remove the subject from the array
    // course.subjects.splice(subjectIndex, 1);

    // Save the updated course document
    // await course.save();
    const subject = await Subject.findOneAndDelete({ subjectname: subjectName })
    if (!subject) {
        return res.status(404).json({ mag: `no subject with id : ${subjectName}` })
    }
    res.status(200).json({ message: 'Subject deleted successfully', course });


})

const updateSubject = asyncWrapper(async (req, res) => {

    // when we update a subject , all the contents of the subject should be updated
    // update course, unit and material

    const { subjectName } = req.params;

    const subject = await Subject.findOneAndUpdate({ subjectname: subjectName }, req.body, {
        new: true,
        runValidators: true
    })

    if (!subject) {
        return res.status(404).json({ msg: `no subject with id : ${subjectId}` })
    }
    res.status(200).json({ subject })

})

module.exports = { createSubject, getSubject, getAllSubjects, deleteSubject, updateSubject };