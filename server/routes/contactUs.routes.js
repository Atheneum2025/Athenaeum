const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../middlewares/verify.js")
// const { sendMessageToAdmin } = require('../utils/contactUs.utils.js')
const {
    sendMessage,
    replyMessage,
} = require("../controllers/contactUs.controller.js");

router.route('/').post(verifyJWT, sendMessage);
router.route("/:notificationId/").post(replyMessage);

module.exports = router;