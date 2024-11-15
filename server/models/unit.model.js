const mongoose = require('mongoose');
const UnitSchema = new mongoose.Schema({
    unitname:{
        type: String,
        trim: true,
        required: true
    },
    description:{
        type: String,
        required: true

    },
    course: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course' 
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    },
    materials: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Material' 
        }
    ]
})

module.exports = mongoose.model('Unit', UnitSchema);
