const ViewLater = require("../models/viewLater.model.js");
const User = require("../models/user.model.js");
const Material = require("../models/material.model.js");
const mongoose = require("mongoose");
const asyncWrapper = require("../middlewares/async.js");

const createViewLater = asyncWrapper(async (req, res) => {
  const { vLMaterialName: materialName } = req.body;
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const existing = await ViewLater.findOne({
    user: userId,
    materialId: materialName,
  });
  const material = await Material.findOne({
    _id:materialName
  })

  if (existing) {
    return res.status(400).json({ message: "Material already saved." });
  }
  const newViewLater = new ViewLater({
    materialId: materialName,
    materialname: material.materialname,
    user: userId,
  });

  await newViewLater.save();

  if (!newViewLater) {
    return res.status(500).json({ message: "could save in viewLater" });
  }
  res.status(200).json({ newViewLater });
});

const getAllViewLaters = asyncWrapper(async (req, res) => {
  const userId = req.user?._id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const allMaterials = await ViewLater.find({
    user: userId,
  });


  res.status(200).json({ allMaterials });
});

const deleteViewLater = asyncWrapper(async (req, res) => {
  const { materialId } = req.params;
  const userId = req.user._id;

  const user = await User.findById(userId);
  user.viewCount = user.viewCount > 0 ? user.viewCount - 1 : user.viewCount;
  await user.save();
  await ViewLater.findOneAndDelete({ user: userId, materialId: materialId });
  res.status(200).json({ message: "Removed successfully!" });
});

const deleteAllViewLater = asyncWrapper(async (req, res) => {
  const userId = req.user._id;

  const deletedAll = await ViewLater.deleteMany({user: userId});
  if(!deletedAll){
    console.log('couldnot delete');
  }
  const user = await User.findById(userId);
  user.viewCount = 0
  await user.save();
  res.status(200).json({message: "deleted all view laters"});
})
module.exports = {
  createViewLater,
  getAllViewLaters,
  deleteViewLater,
  deleteAllViewLater,
};
