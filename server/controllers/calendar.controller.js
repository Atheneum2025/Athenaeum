const Calendar = require('../models/calendar.model.js');
const User = require('../models/user.model.js')
const asyncWrapper = require('../middlewares/async.js');

const createEvent = asyncWrapper( async (req, res) => {
    const user = req.user;
    const {event, date} = req.body;

    const newEvent = new Calendar({
        event : event,
        date : date,
        user : user._id
    })

    if(!newEvent){
        return res.status(500).json({message: "event creation failed"});
    }

    res.status(200).json({newEvent});
})

const getAllEvents = asyncWrapper( async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if(!user){
        return res.status(401).json({message: "Unauthorised"});
    }
    const events = Calendar.find({user: userId});

    if(!events){
        return res.status(400).json({message: "No events found"})
    }
    res.status(200).json({events});
})

const deleteEvent = asyncWrapper( async (req, res) => {
    const user = req.user;

})

module.exports = {
  createEvent,
  getAllEvents,
  deleteEvent,
};