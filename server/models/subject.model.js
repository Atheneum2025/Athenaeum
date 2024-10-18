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
    course: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Course' 
    }
})

module.exports = mongoose.model('Subject', SubjectSchema);
