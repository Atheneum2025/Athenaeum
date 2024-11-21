const User = require('../models/user.model');
const asyncWrapper = require('../middlewares/async');

//All these routes are only for the admin
const getAllUsers = asyncWrapper(async (req, res) => {

    const users = await User.find({})
    res.status(200).json({ Users: users });

})

//this createUser route is not required
const createUser = asyncWrapper(async (req, res) => {

    const user = await User.create(req.body);
    res.status(201).json({ user });

})

const getUser = asyncWrapper(async (req, res) => {

        const { id: UserID } = req.params;
        const user = await User.findOne({ _id: UserID })
    
        if (!user) {
            return res.status(404).json({ mag: `no User with id : ${UserID}` })
        }
        res.status(200).json({ user })
    
    
    }
)

const updateUser = asyncWrapper(async (req, res) => {

    const { id: UserID } = req.params;

    const user = await User.findOneAndUpdate({ _id: UserID }, req.body, {
        new: true,
        runValidators: true
    })

    if (!user) {
        return res.status(404).json({ mag: `no User with id : ${UserID}` })
    }
    res.status(200).json({ user })

})

// this route will be accessible to all users
const deleteUser = asyncWrapper(async (req, res) => {

    const { id: UserID } = req.params;
    const user = await User.findOneAndDelete({ _id: UserID })
    if (!user) {
        return res.status(404).json({ mag: `no User with id : ${UserID}` })
    }
    res.status(200).json({ user });

})

module.exports = {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser
}