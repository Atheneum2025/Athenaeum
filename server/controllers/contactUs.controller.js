const mongoose = require('mongoose')
const Notifications = require('../models/notifications.model.js');
const Users = require('../models/user.model.js');
const ContactUs = require('../models/contactus.model.js')
const asyncWrapper = require('../middlewares/async.js');

const getAllMessages = asyncWrapper(async (req, res) => {
    // const userId = req.user?._id;
    const messages = await ContactUs.find({})
    res.status(200).json({messages});
})

const sendMessage = asyncWrapper(async( req, res) => {
    const userId = req.user?._id;
    const {message} = req.body;
    const user = await Users.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "messageBy",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $project: {
                password: 0,
                refreshToken: 0,
            }
        }
    ])

    const messaged = new ContactUs({
        message: message,
        sender: user[0].username,
    });
    await messaged.save();

    if(!messaged){
        return res.status(400).json({ message: "ok" });
    }

    res.status(200).json({message: "done"});
})

const replyMessage = asyncWrapper(async (req, res) => {
    const userId = req.user?._id;
    const {replyMessage} = req.body;
    const {messageId} = req.params;

    const message = await ContactUs.findByIdAndUpdate(
        messageId,
        { $set: { reply: replyMessage } },
        { new: true },
        { runValidators: true }
    );
    if(!message){
        return res.status(404).json({message: "not found"});
    }

    res.status(200).json({message: "reply sent"})
})

module.exports = {
    getAllMessages,
    sendMessage,
    replyMessage
}





