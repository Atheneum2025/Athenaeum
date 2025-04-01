const Quiz = require("../models/quiz.model.js");
const Leaderboard = require("../models/leaderboard.model.js");
const asyncWrapper = require("../middlewares/async.js");

const createQuiz = asyncWrapper( async(req, res) => {
    const user = req.user?.username;
    const quiz = await Quiz.create({...req.body, author: user});
    res.status(200).json({quiz});
})

const getAllQuizes = asyncWrapper( async(req, res) => {
    const quizes = await Quiz.find({});
    res.status(200).json({quizes});
})

const getAQuiz = asyncWrapper( async(req, res) => {
    const {quizId} = req.params;
    const quiz = await Quiz.findById(quizId);

    if(!quiz){
        return res.status(400).json({message: `no quiz with id ${quizId}`});
    }
    res.status(200).json({quiz});

})

const createLeaderboard = asyncWrapper( async(req, res) => {
    const {quizId} = req.params;
    const user = req.user;
    const {currentScore : score} = req.body;
    // if(!userId){
    //     return res.status(400).json({message: "unauthorised"})
    // }
    const leaderboard = await Leaderboard.create({student: user?._id, studentname: user?.username, score: score, quiz: quizId})
    res.status(200).json({ leaderboard });
})

const getLeaderboard = asyncWrapper( async(req, res) => {
    const {quizId} = req.params;
    const leaderboard = await Leaderboard.find({quiz: quizId});
    res.status(200).json({leaderboard});
})
module.exports = {
    createQuiz,
    getAllQuizes,
    getAQuiz,
    createLeaderboard,
    getLeaderboard,
}