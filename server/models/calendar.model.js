const mongoose = require('mongoose');
const CalendarSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    event: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now(),
    }
})

module.exports = mongoose.model("Calendar",CalendarSchema);