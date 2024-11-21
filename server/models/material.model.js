const mongoose = require('mongoose');
const MaterialSchema = new mongoose.Schema({
    materialname:{
        type: String,
        trim: true,
        required: true
    },
    description:{
        type: String,
        required: false

    },
    fileType:{
        type: String,
        required: false
    },
    course: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course' 
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    },
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit'
    },
})

module.exports = mongoose.model('Material', MaterialSchema);
