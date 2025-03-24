const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Course",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        rating: { 
            type: Number, 
            required: true, 
            min: 1, 
            max: 5 
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Rating", RatingSchema);
