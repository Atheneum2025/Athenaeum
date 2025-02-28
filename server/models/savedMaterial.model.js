const mongoose = require('mongoose');

const SavedMaterialSchema = new mongoose.Schema(
  {
    materialId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Material",
    },
    itemName: {
      type: String,
      red: "Material",
    },
    savedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SavedMaterial', SavedMaterialSchema)