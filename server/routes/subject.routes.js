const express = require('express');
const router = express.Router();

const {giveAllsubjects} = require('../controllers/subject.controller');

router.route('/')
    .get(giveAllsubjects)

module.exports = router;