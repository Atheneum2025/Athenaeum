const User = require("../models/user.model");
const Notifications = require("../models/notifications.model");
const Materials = require("../models/material.model.js");
const asyncWrapper = require("../middlewares/async");
const mongoose = require("mongoose");

//All these routes are only for the admin
const getAllUsers = asyncWrapper(async (req, res) => {
    const users = await User.find({});
    res.status(200).json({ users: users });
});

const getAllStudents = asyncWrapper(async (req, res) => {
    const students = await User.find({ role: "student" });
    res.status(200).json({ students });
});

const getAllProfessors = asyncWrapper(async (req, res) => {
    const professors = await User.find({ role: "professor" });
    res.status(200).json({ professors });
});

//this createUser route is not required
const createUser = asyncWrapper(async (req, res) => {
    const user = await User.create(req.body);
    res.status(201).json({ user });
});

// this function is for uploading avatar
const uploadAvatar = asyncWrapper(async (req, res) => {
    const userId = req.user?._id;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(401).json({ message: "no user found" });
    }
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        return res
            .status(400)
            .json({ message: "Avatar file local path required" });
    }
    const fileSize = req.file?.size;

    const avatar = await uploadOnCloudinary(avatarLocalPath, fileSize);

    if (!avatar) {
        return res.status(500).json({ message: "avatar not found" });
    }
    const changed = await User.findByIdAndUpdate(
        userId,
        { $set: { avatar: avatar.url } },
        { new: true }
    );
});
const getUser = asyncWrapper(async (req, res) => {
    const { id: UserID } = req.params;
    const user = await User.findOne({ _id: UserID });

    if (!user) {
        return res.status(404).json({ mag: `no User with id : ${UserID}` });
    }
    res.status(200).json({ user });
});

const getUserMaterial = asyncWrapper(async (req, res) => {
    const { id: userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(401).json({ message: "user not found" });
    }

    const materials = await Materials.find({ owner: userId });
    res.status(200).json({ materials });
});

const updateUser = asyncWrapper(async (req, res) => {
    const { id: UserID } = req.params;

    const user = await User.findOneAndUpdate({ _id: UserID }, req.body, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        return res.status(404).json({ mag: `no User with id : ${UserID}` });
    }
    res.status(200).json({ user });
});

const requestToChangeRole = asyncWrapper(async (req, res) => {
    const { id: userId } = req.params;
    const { phoneNo, collegename, collegenumber,prNo } = req.body;
    const message = `A user with PR number is ${prNo} and phone number ${phoneNo}, wants to become a prefessor from college ${collegename} with the number ${collegenumber}.`;
    const notify = new Notifications({
        message: message,
        messageBy: userId,
    });
    await notify.save();
    if(!notify){
        return res.status(400).json({message: "couldnt notify"});
    }
    console.log(notify);
    res.status(200).json({message: "done"});
})
const updateRole = asyncWrapper(async (req, res) => {
    const { id: userId } = req.params;
    const  {phoneNo}  = req.body;
    const user = await User.findByIdAndUpdate(
        userId,
        { $set: { role: "professor", phoneNo: phoneNo } },
        { new: true },
        { runValidators: true }
    );

    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json({ message: "role updated" });
});

// this route will be accessible to all users
const deleteUser = asyncWrapper(async (req, res) => {
    const { id: UserID } = req.params;
    const user = await User.findOneAndDelete({ _id: UserID });
    console.log('user deleted');
    if (!user) {
        return res.status(404).json({ mag: `no User with id : ${UserID}` });
    }
    res.status(200).json({ user });
});

const toggleUserActiveness = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const updated = await User.findByIdAndUpdate(
        id,
        { $set: { isActive: !user.isActive } },
        { new: true },
        { runValidators: true }
    );

    if (!updated) {
        return res.status(400).json({ message: "Cannot update user" });
    }

    res.status(200).json({ message: "User updated" });
});

const getUserViewHistory = asyncWrapper(async (req, res) => {
    const userId = req.user?._id;
    const history = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id),
            },
        },
        {
            $unwind: "$viewHistory",
        },
        {
            $lookup: {
                from: "materials",
                localField: "viewHistory.materialId",
                foreignField: "_id",
                as: "History",
            },
        },
        {
            $unwind: "$History",
        },
        {
            $project: {
                user: "$username",
                MaterialName: "$History.materialname",
                course: "$History.course",
                subject: "$History.subject",
                unit: "$History.unit",
            },
        },
    ]);

    return res.status(200).json({ history: history });
});

const deleteAllUserViewHistory = asyncWrapper(async (req, res) => {
    const userId = req.user._id;

    const deletedHistory = await User.updateOne(
        { _id: userId },
        {
            $set: { viewHistory: [] },
        }
    );

    if (!(deletedHistory.modifiedCount > 0)) {
        return res.status(400).json({ message: "Cannot delete history" });
    }
    return res.status(200).json({ message: "History Deleted " });
});

const getAllNotifications = asyncWrapper(async (req, res) => {
    const notifications = await Notifications.find({});

    // const username = await Notifications.aggregate([
    //     {
    //         $match: {
    //             _id: new mongoose.Types.ObjectId(userId),
    //         },
    //     },
    //     {
    //         $lookup: {
    //         from: "users",
    //         localField: "owner",
    //         foreignField: "_id",
    //         as: "user",
    //         },
    //     },
    // ])
    res.status(200).json({ notifications });
});

const deleteNotification = asyncWrapper(async (req, res) => {});

module.exports = {
    getAllUsers,
    getAllStudents,
    getAllProfessors,
    createUser,
    uploadAvatar,
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
};
