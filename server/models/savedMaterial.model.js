const mongoose = require('mongoose');

const SavedMaterialSchema = new mongoose.Schema({
    materialId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Material'
    },
    unit: {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'Unit'
    },
    subject: {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'Subject'
    },
    course: {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'Course'
    },
    savedBy: {
        type: mongoose.Types.ObjectId,
        // required: true,
        ref: 'User'
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model('SavedMaterial', SavedMaterialSchema)