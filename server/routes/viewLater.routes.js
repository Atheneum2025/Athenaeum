const express = require("express");
const router = express.Router();
const { verifyJWT } = require('../middlewares/verify.js')

const {
  getAllViewLaters,
  createViewLater,
  deleteViewLater,
  deleteAllViewLater,
} = require("../controllers/viewLater.controller.js");

router.route("/").get(verifyJWT, getAllViewLaters).post(verifyJWT, createViewLater)
router.route("/remove/:materialId").delete(verifyJWT, deleteViewLater);
router.route("/deleteAll").delete(verifyJWT, deleteAllViewLater);

module.exports = router;
