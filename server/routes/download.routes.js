const express = require('express');
const router = express.Router();

const {downloadMaterial} = require('../controllers/download.controller');

router.route('/').post(downloadMaterial);
module.exports = router;