const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
    coursename:{
        type: String,
        trim: true,
        required: true
    },
    description:{
        type: String,
        required: true

    },
    subjects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subjects' 
        }
    ]
})

module.exports = mongoose.model('Course', CourseSchema);
