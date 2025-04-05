const mongoose = require("mongoose");

const LeaderboardSchema = new mongoose.Schema({

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    studentname: {
        type: String,
    },
    score: {
        type: Number,
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
    },
},{timestamps: true})

module.exports = mongoose.model("Leaderboard", LeaderboardSchema);