const mongoose = require("mongoose");
const ProfessorDetailsSchema = new mongoose.Schema({
    professorId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    collegeName: {
        type: String
    },
    experience: {
        type: Number,
        min: 2
    },
    AadharCard: {
        type: String  // cloudinary url
    },
    CollegeIdCard: {
        type: String //cloudinary url
    },
    Degree:{
        type: String //cloudinary url
    }
},
{
    timestamps: true,
}
)

module.exports = mongoose.model( "ProfessorDetails", ProfessorDetailsSchema);