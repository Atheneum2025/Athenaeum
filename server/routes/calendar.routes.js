const express = require('express')
const router = express.Router();
const {getAllEvents, createEvent, deleteEvent} = require('../controllers/calendar.controller.js')

router.route('/')
    .get(getAllEvents)
    .post(createEvent)
router.route('/:_id').delete(deleteEvent);

module.exports = router;