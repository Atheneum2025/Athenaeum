const mongoose = require("mongoose");
const Notification = require("./notifications.model.js");

const QuizSchema = new mongoose.Schema({
    quizName: {
        type: String,
        required: true,
    },
    selectedSubject: {
        type: String,
        required: false,
    },
    questionOne: {
        type: String
    },
    answerOne: {
        type: Boolean
    },
    questionTwo: {
        type: String
    },
    answerTwo: {
        type: Boolean
    },
    questionThree: {
        type: String
    },
    answerThree: {
        type: Boolean
    },
    questionFour: {
        type: String
    },
    answerFour: {
        type: Boolean
    },
    questionFive: {
        type: String
    },
    answerFive: {
        type: Boolean
    },
    author: {
        type: String,
        required: true,
    }
},{timestamps: true})

// QuizSchema.post('save', async function(next){
//     const notificationCreated = await new Notification({
//         message: "New Quiz uploaded",
//         messageBy: ""
//     })
// })

module.exports = mongoose.model("Quiz", QuizSchema);
