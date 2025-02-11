const express = require("express");
const router = express.Router();

const {createQuiz, getAQuiz, getAllQuizes, createLeaderboard, getLeaderboard} = require("../controllers/quiz.controller.js");
const {verifyJWT} = require("../middlewares/verify.js")

router.route('/').get(getAllQuizes).post(verifyJWT, createQuiz);
router.route("/:quizId").get(getAQuiz);
router.route("/:quizId/leaderboard/").post(verifyJWT, createLeaderboard).get(getLeaderboard);


module.exports = router;