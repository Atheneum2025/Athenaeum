const Material = require('../models/material.model');
const {} = require('mongoose');
const asyncWrapper = require('../middlerware/async');


const createMaterial = asyncWrapper(async (req, res) => {

    const material = await Material.create(req.body)
    res.status(201).json({ material })
})

const getMaterial = asyncWrapper(async (req, res) => {

    const { id: materialId } = req.params;
    console.log(materialId);
    const material = await Material.findOne({ _id: materialId });

    if (!material) {
        return res.status(404).json({ mag: `no material with id : ${materialId}` });
    }
    res.status(200).json({ material });


})

const getAllMaterials =  asyncWrapper( async (req, res) => {

    const materials = await Course.find({})
    res.status(200).json({ courses: materials });

})

const deleteMaterial = asyncWrapper(async (req, res) => {

    const { id: materialId } = req.params;
    const material = await Material.findOneAndDelete({ _id: materialId })
    if (!material) {
        return res.status(404).json({ mag: `no material with id : ${materialId}` })
    }
    res.status(200).json({ material });

})

const updateMaterial = asyncWrapper(async (req, res) => {

    const { id: materialId } = req.params;

    const material = await Material.findOneAndUpdate({ _id: materialId }, req.body, {
        new: true,
        runValidators: true
    })

    if (!material) {
        return res.status(404).json({ mag: `no material with id : ${materialId}` })
    }
    res.status(200).json({ material })

})

module.exports = {createMaterial, getMaterial, getAllMaterials, deleteMaterial, updateMaterial};