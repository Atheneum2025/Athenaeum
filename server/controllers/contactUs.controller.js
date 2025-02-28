const mongoose = require('mongoose')
const Notifications = require('../models/notifications.model.js');
const Users = require('../models/user.model.js');
const asyncWrapper = require('../middlewares/async.js');

const sendMessage = asyncWrapper(async( req, res) => {
    const userId = req.user?._id;
    const {message , replyMessage} = req.body;
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

    const messaged = new Notifications({
        message: message,
        messageBy: user[0].username,
      });
    await messaged.save();

    if(!messaged){
        return res.status(400).json({ message: "ok" });
    }

    res.status(200).json({message: "done"});
})

const replyMessage = asyncWrapper(async (req, res) => {
    const {replyMessage} = req.body;
    const {notificationId} = req.params;

    const notification = await Notifications.findByIdAndUpdate(
        notificationId,
        {$set: {reply: replyMessage}},
        {new: true},
        {runValidators:true}
    )
    if(!notification){
        return res.status(404).json({message: "not found"});
    }

    res.status(200).json({message: "reply sent"})
})

module.exports = {
    sendMessage,
    replyMessage
}





