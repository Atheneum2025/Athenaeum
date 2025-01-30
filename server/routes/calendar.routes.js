const express = require('express')
const router = express.Router();
const {getAllEvents, createEvent} = require('../controllers/calendar.controller.js')

router.route('/')
    .get(getAllEvents)
    .post(createEvent)

module.exports = router;