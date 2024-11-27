const Unit = require('../models/unit.model');
const Subject = require('../models/subject.model');
const Course = require('../models/course.model')
const {} = require('mongoose');
const asyncWrapper = require('../middlewares/async');

// done
const createUnit = asyncWrapper(async (req, res) => {

    // when a unit is created , the subject needs to be updated
    const { unitname, description } = req.body;
    const {courseName, subjectName} = req.params;
    console.log(subjectName)
    const subject = await Subject.findOne({subjectname : subjectName});
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    // const subjects = await Subjects.create(req.body)
    console.log(req.body)
    const newUnit = new Unit({ unitname, description, course: courseName, subject: subjectName });
    await newUnit.save();

    // Add the subject to the course
    // subject.units.push(newUnit._id);
    // await subject.save();
    res.status(201).json({ newUnit })
})

// done
const getUnit = asyncWrapper(async (req, res) => {

    const { courseName, subjectName, unitName } = req.params;
    const unit = await Unit.findOne({unitname: unitName })

    if (unit.subject !== subjectName) {
        return res.status(404).json({ msg: `no unit with name : ${unitName}` })
    }
    res.status(200).json({ unit })


})

// done
const getAllUnits =  asyncWrapper( async (req, res) => {

    const {courseName, subjectName} = req.params
    const units = await Unit.find({course: courseName, subject: subjectName});
    res.status(200).json({ units: units });

})

const deleteUnit = asyncWrapper(async (req, res) => {

    // when we delete a unit , all the contents of the unit should be deleted
    // delete material

    // solution
    // and update the subject and course collection which has this unit in its array of subject

    const { unitName, subjectName} = req.params;
    const subject = await Subject.find({ subjectname: subjectName })
    console.log(subject)
    if (!subject) {
        return res.status(404).json({ msg: `no subject with name : ${subjectName}` })
    }

    // deleteing the unit
    const unit = await Unit.findOneAndDelete({ unitname: unitName })
    if (!unit) {
        return res.status(404).json({ mag: `no unit with id : ${unitName}` })
    }
    
    res.status(200).json({ message: 'Unit deleted successfully', subject });

})

const updateUnit = asyncWrapper(async (req, res) => {

    // when we update a unit , all the contents of the unit should be updated
    // update subject and material

    const { id: unitId } = req.params;

    const unit = await Unit.findOneAndUpdate({ _id: unitId }, req.body, {
        new: true,
        runValidators: true
    })

    if (!unit) {
        return res.status(404).json({ mag: `no unit with id : ${unitId}` })
    }
    res.status(200).json({ unit })

})

module.exports = {createUnit, getAllUnits, getUnit, deleteUnit, updateUnit};