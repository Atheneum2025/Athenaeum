const express = require('express');
const router = express.Router();
const { verify, verifyJWT } = require('../middlewares/verify.js')

const { logInUser, logoutUser, refreshAccessToken, changeCurrentPassword } = require('../controllers/login.controller');
const { signUpUser } = require('../controllers/signup.controller');

router.route('/login')
    .post(logInUser);
router.route('/signup')
    .post(signUpUser);

// secured routes
router.route('/logout')
    .post(verifyJWT, logoutUser);
router.route('/refresh-token')
    .post(refreshAccessToken);
router.route('/change-password')
    .post(verifyJWT, changeCurrentPassword);

module.exports = router;