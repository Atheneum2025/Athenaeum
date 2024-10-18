const express = require('express');
const router = express.Router();

const {logInUser} = require('../controllers/login.controller');
const {signUpUser} = require('../controllers/signup.controller');

router.route('/login').post(logInUser);
router.route('/signup').post(signUpUser);

module.exports = router;