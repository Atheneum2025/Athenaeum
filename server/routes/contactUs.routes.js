const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../middlewares/verify.js")
const { sendMessageToAdmin } = require('../utils/contactUs.utils.js')

router.route('/contactUs').post(verifyJWT, sendMessageToAdmin);

module.exports = router;