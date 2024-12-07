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
} = require("../controllers/user.controller");
const { verifyJWT } = require("../middlewares/verify.js");

router.route("/").get(getAllUsers).post(createUser);
router.route("/us/:id").get(getUser).patch(updateUser).delete(deleteUser);
router.route("/history").get(verifyJWT, getUserViewHistory);
router.route("/delete-history").delete(verifyJWT, deleteAllUserViewHistory);
// router.route('/api/v1/user').get(Verify, (req, res) => {
//     res.status(200).json({
//         status: "success",
//         message: "Welcome to the your Dashboard!",
//     });
// });

module.exports = router;
