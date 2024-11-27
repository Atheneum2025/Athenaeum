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
        type: String,
        ref: 'Course' 
    },
    subject: {
        type: String,
        ref: 'Subject'
    },
    unit: {
        type: String,
        ref: 'Unit'
    },
    uploadedBy: {
        type: String,
        ref: 'User'
    }
})



module.exports = mongoose.model('Material', MaterialSchema);
