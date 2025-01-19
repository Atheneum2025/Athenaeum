const express = require('express');
const multer = require('multer');
const router = express.Router();

const {giveAllmaterials} = require('../controllers/material.controller');

router.route('/').get(giveAllmaterials);
module.exports = router;