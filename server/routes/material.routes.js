const express = require('express');
const multer = require('multer');
const router = express.Router();

const {
  giveAllmaterials,
  getMaterialsByUser,
  getMaterialForStudent,
} = require("../controllers/material.controller");
const { verifyJWT } = require("../middlewares/verify.js")

router.route('/').get(giveAllmaterials);
router.route("/by-user").get(verifyJWT, getMaterialsByUser);
router.route("/by-student").get(verifyJWT, getMaterialForStudent)
module.exports = router;