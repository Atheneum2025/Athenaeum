const SavedMaterial = require("../models/savedMaterial.model.js");
const Material = require("../models/material.model.js");
const mongoose = require("mongoose");
const asyncWrapper = require("../middlewares/async.js");

// toggle Save controller for saving and unsaving material
const toggleMaterialSave = asyncWrapper(async (req, res) => {
    // take userId from request
    const userId = req.user?._id;
    // take materialID from params
    const { materialName } = req.params;
    // check if the save is there in saveMaterial collection

    const itemName = await Material.findOne({ _id: materialName });

    const isSaved = await SavedMaterial.findOne({
        materialId: materialName,
        savedBy: userId,
    });
    
    if (isSaved) {
        await SavedMaterial.findByIdAndDelete(isSaved?._id);
        return res.status(200).json({ isSaved: false });
    }

    //   // save it to the saved db
    const newSavedMaterial = new SavedMaterial({
        savedBy: userId,
        materialId: materialName,
        itemName: itemName.materialname,
    });
    await newSavedMaterial.save();
    if (!newSavedMaterial) {
        return res.status(401).json({ isSaved: !!newSavedMaterial });
    }
    res.status(200).json({ isSaved: !!newSavedMaterial });
});
const getAllSavedMaterials = asyncWrapper(async (req, res) => {
    // show all saves from the users
    // take userId from request
    const userId = req.user?._id;

    const allSavedMaterials = await SavedMaterial.find({ savedBy: userId });
    if (!allSavedMaterials) {
        return res.status(401).json({ message: "no saves found" });
    }
    res.status(200).json({ savedMaterials: allSavedMaterials });
});

module.exports = { toggleMaterialSave, getAllSavedMaterials };
