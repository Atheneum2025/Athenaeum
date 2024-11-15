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
            ref: 'Subject' 
        }
    ]
})

module.exports = mongoose.model('Course', CourseSchema);
