const express = require('express');
const router = express.Router();
// const {verify} = require('../middlewares/verify');


const {uploadMaterial} = require('../controllers/upload.controller');

router.route('/').post(uploadMaterial);
module.exports = router;