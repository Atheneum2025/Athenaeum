const express = require("express");
const router = express.Router();
const {
    getAllUsers,
    getAllStudents,
    getAllProfessors,
    createUser,
    getUser,
    getUserMaterial,
    updateUser,
    requestToChangeRole,
    updateRole,
    deleteUser,
    getUserViewHistory,
    deleteAllUserViewHistory,
    getAllNotifications,
    deleteNotification,
    toggleUserActiveness,
} = require("../controllers/user.controller");
const {
    togglePublishMaterial,
    getMaterialStats,
    getData,
} = require("../controllers/material.controller.js");
const {getAllSavedMaterials} = require("../controllers/savedMaterial.controller.js")
const {
  getAllEvents,
  createEvent,
  deleteEvent,
} = require("../controllers/calendar.controller.js");

const { verifyJWT } = require("../middlewares/verify.js");

router.route("/").get(getAllUsers).post(createUser);
router.route("/students").get(getAllStudents);
router.route("/professors").get(getAllProfessors);
router.route("/c/:id").get(getUser).patch(updateUser).delete(deleteUser);
router.route("/c/:id/request").post(requestToChangeRole);
router.route("/c/:id/role").patch(updateRole);
router.route("/c/:id/materials").get(getUserMaterial);
router.route("/history").get(verifyJWT, getUserViewHistory);
router.route("/delete-history").delete(verifyJWT, deleteAllUserViewHistory);
router.route("/toggleActive/:id").patch(toggleUserActiveness);
router.route("/notifications").get( getAllNotifications);
router.route("/notification/:notificationId").delete( deleteNotification);
router.route("/notification/:notificationId/publish").patch(togglePublishMaterial);
router.route("/materials/stats").get(verifyJWT, getMaterialStats);
router.route("/materials/count").get(verifyJWT, getData);
router.route("/save").get(verifyJWT, getAllSavedMaterials);
router
  .route("/:userId/calendar")
  .get(verifyJWT,getAllEvents)
  .post(verifyJWT, createEvent);
router.route("/:userId/calendar/:id")
  .delete(verifyJWT, deleteEvent)
  
// router.route('/api/v1/user').get(Verify, (req, res) => {
//     res.status(200).json({
//         status: "success",
//         message: "Welcome to the your Dashboard!",
//     });
// });

module.exports = router;
