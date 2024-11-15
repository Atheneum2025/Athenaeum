const Unit = require('../models/unit.model');
const Subject = require('../models/subject.model');
const {} = require('mongoose');
const asyncWrapper = require('../middlewares/async');


const createUnit = asyncWrapper(async (req, res) => {
    const { unitname, description } = req.body;
    const {id: subjectId} = req.params;
    console.log(subjectId)
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    // const subjects = await Subjects.create(req.body)
    console.log(req.body)
    const newUnit = new Unit({ unitname, description, subject: subjectId });
    await newUnit.save();

    // Add the subject to the course
    subject.units.push(newUnit._id);
    await subject.save();
    res.status(201).json({ newUnit })
})

const getUnit = asyncWrapper(async (req, res) => {

    const { id: unitId } = req.params;
    const unit = await Unit.findOne({ _id: unitId })

    if (!unit) {
        return res.status(404).json({ mag: `no unit with id : ${unitId}` })
    }
    res.status(200).json({ unit })


})

const getAllUnits =  asyncWrapper( async (req, res) => {

    const units = await Unit.find({})
    res.status(200).json({ units: units });

})

const deleteUnit = asyncWrapper(async (req, res) => {

    const { id: unitId } = req.params;
    const unit = await Unit.findOneAndDelete({ _id: unitId })
    if (!unit) {
        return res.status(404).json({ mag: `no unit with id : ${unitId}` })
    }
    res.status(200).json({ unit });

})

const updateUnit = asyncWrapper(async (req, res) => {

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