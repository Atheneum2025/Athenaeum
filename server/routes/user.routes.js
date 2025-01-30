const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getUserViewHistory,
  deleteAllUserViewHistory,
  getAllNotifications,
  deleteNotification
} = require("../controllers/user.controller");
const {togglePublishMaterial} = require("../controllers/material.controller.js")
const {getAllSavedMaterials} = require("../controllers/savedMaterial.controller.js")
const { verifyJWT } = require("../middlewares/verify.js");

router.route("/").get(getAllUsers).post(createUser);
router.route("/us/:id").get(getUser).patch(updateUser).delete(deleteUser);
router.route("/history").get( getUserViewHistory);
router.route("/delete-history").delete(verifyJWT, deleteAllUserViewHistory);
router.route("/notifications").get( getAllNotifications);
router.route("/notification/:notificationId").delete( deleteNotification);
router.route("/notification/:notificationId/publish").patch(togglePublishMaterial);
router.route("/save").get(getAllSavedMaterials);
// router.route('/api/v1/user').get(Verify, (req, res) => {
//     res.status(200).json({
//         status: "success",
//         message: "Welcome to the your Dashboard!",
//     });
// });

module.exports = router;
