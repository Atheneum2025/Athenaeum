const Quiz = require("../models/quiz.model.js");
const asyncWrapper = require("../middlewares/async.js");

const createQuiz = asyncWrapper( async(req, res) => {
    const user = req.user?._id;
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

module.exports = {
    createQuiz,
    getAllQuizes,
    getAQuiz
}