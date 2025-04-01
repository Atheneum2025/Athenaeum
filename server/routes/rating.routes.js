const express = require('express');
const router = express.Router();

const {rateCourse, getRating} = require('../controllers/rating.controller.js');
const { verifyJWT } = require("../middlewares/verify.js")

router.route('/').post(verifyJWT, rateCourse);
router.route('/courseId').get(verifyJWT, getRating);

module.exports = router;