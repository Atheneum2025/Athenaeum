const mongoose = require('mongoose');
const ViewLaterSchema = mongoose.Schema({
    materialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material",
    },
    materialname: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, {timestamps: true})

module.exports = mongoose.model("ViewLater", ViewLaterSchema);