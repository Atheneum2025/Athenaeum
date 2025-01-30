const mongoose = require("mongoose");

const LeaderboardSchema = new mongoose.Schema({

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    score: {
        type: Number,
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
    },
})

module.exports = mongoose.model("Leaderboard", LeaderboardSchema);