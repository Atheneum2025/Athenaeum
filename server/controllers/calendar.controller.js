const Calendar = require('../models/calendar.model.js');
const User = require('../models/user.model.js')
const asyncWrapper = require('../middlewares/async.js');

const createEvent = asyncWrapper( async (req, res) => {
    const userId = req.user._id;
    const {title, date} = req.body;
    const event = new Calendar({
        title : title,
        date: date,
        user : userId
    })
    await event.save();

    if(!event){
        return res.status(500).json({message: "event creation failed"});
    }

    res.status(200).json({event});
})

const getAllEvents = asyncWrapper( async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if(!user){
        return res.status(401).json({message: "Unauthorised"});
    }
    const events = await Calendar.find({user: userId});

    if(!events){
        return res.status(400).json({message: "No events found"})
    }

    res.status(200).json({events});
})

const deleteEvent = asyncWrapper( async (req, res) => {
    const {id} = req.params;
    await Calendar.findByIdAndDelete(id);
    res.status(200).json({message: "event delelted"}); 
})

module.exports = {
  createEvent,
  getAllEvents,
  deleteEvent,
};