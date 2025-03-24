const express = require('express');
const router = express.Router();

const {rateCourse, getRating} = require('../controllers/rating.controller.js');
const { verifyJWT } = require("../middlewares/verify.js")

router.route('/').get(getRating).post(verifyJWT, rateCourse);

module.exports = router;