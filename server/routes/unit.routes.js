const express = require('express');
const router = express.Router();

const {giveAllunits} = require('../controllers/unit.controller');

router.route('/')
    .get(giveAllunits)

module.exports = router;