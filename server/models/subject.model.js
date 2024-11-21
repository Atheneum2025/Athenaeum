const mongoose = require('mongoose');
const SubjectSchema = new mongoose.Schema({
    subjectname:{
        type: String,
        trim: true,
        required: true
    },
    description:{
        type: String,
        required: true

    },
    year:{
        type: String,
        required: false
    },
    course: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course' 
    },
    units: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Unit' 
        }
    ]
})

module.exports = mongoose.model('Subject', SubjectSchema);
