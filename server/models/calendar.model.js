const mongoose = require('mongoose');
const CalendarSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
    },
    date: {
        type: Date,
    },
    reminderSent: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("Calendar",CalendarSchema);