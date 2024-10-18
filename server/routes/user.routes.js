const express = require('express');
const router = express.Router();
const {getAllUsers, createUser, getUser, updateUser, deleteUser} = require('../controllers/user.controller');


router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
// router.route('/api/v1/user').get(Verify, (req, res) => {
//     res.status(200).json({
//         status: "success",
//         message: "Welcome to the your Dashboard!",
//     });
// });


 

module.exports = router;