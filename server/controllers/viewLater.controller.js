const ViewLater = require("../models/viewLater.model.js");
const User = require("../models/user.model.js");
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
    materialName: materialName,
  });
  if (existing) {
    return res.status(400).json({ message: "Material already saved." });
  }
  const newViewLater = new ViewLater({
    materialName: materialName,
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
  console.log(materialId)
  await ViewLater.findOneAndDelete({ user: userId, materialName: materialId });
  res.status(200).json({ message: "Removed successfully!" });
});

module.exports = {
  createViewLater,
  getAllViewLaters,
  deleteViewLater,
};
