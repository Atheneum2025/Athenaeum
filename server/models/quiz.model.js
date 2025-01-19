const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
    quizName: {
        type: String,
        required: true,
    },
    questionOne: {
        type: String
    },
    answerOne: {
        type: String
    },
    questionTwo: {
        type: String
    },
    answerTwo: {
        type: String
    },
    questionThree: {
        type: String
    },
    answerThree: {
        type: String
    },
    questionFour: {
        type: String
    },
    answerFour: {
        type: String
    },
    questionFive: {
        type: String
    },
    answerFive: {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
})

module.exports = mongoose.model("Quiz", QuizSchema);
