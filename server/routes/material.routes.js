const express = require('express');
const multer = require('multer');
const router = express.Router();

const {
  giveAllmaterials,
  getMaterialsByUser,
} = require("../controllers/material.controller");
const { verifyJWT } = require("../middlewares/verify.js")

router.route('/').get(giveAllmaterials);
router.route("/:userId").get(verifyJWT, getMaterialsByUser);
module.exports = router;