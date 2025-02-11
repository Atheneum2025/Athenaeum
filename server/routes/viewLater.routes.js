const express = require("express");
const router = express.Router();
const { verifyJWT } = require('../middlewares/verify.js')

const {
  getAllViewLaters,
  createViewLater,
  deleteViewLater,
} = require("../controllers/viewLater.controller.js");

router.route("/").get(verifyJWT, getAllViewLaters).post(verifyJWT, createViewLater)
router.route("/:materialId").delete(verifyJWT, deleteViewLater);

module.exports = router;
