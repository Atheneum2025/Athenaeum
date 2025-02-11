const mongoose = require('mongoose');
const ViewLaterSchema = mongoose.Schema({
    materialName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

})

module.exports = mongoose.model("ViewLater", ViewLaterSchema);