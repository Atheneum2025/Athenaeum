const Calendar = require("../models/calendar.model.js");
const User = require("../models/user.model.js");
const Notification = require("../models/notifications.model.js");
const asyncWrapper = require("../middlewares/async.js");
const cron = require("node-cron");

const createEvent = asyncWrapper(async (req, res) => {
    const userId = req.user._id;
    const { title, date } = req.body;
    const event = new Calendar({
        title: title,
        date: date,
        user: userId,
    });
    await event.save();

    if (!event) {
        return res.status(500).json({ message: "event creation failed" });
    }

    res.status(200).json({ event });
});

const getAllEvents = asyncWrapper(async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(401).json({ message: "Unauthorised" });
    }
    const events = await Calendar.find({ user: userId });

    if (!events) {
        return res.status(400).json({ message: "No events found" });
    }

    res.status(200).json({ events });
});

const deleteEvent = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    await Calendar.findByIdAndDelete(id);
    res.status(200).json({ message: "event delelted" });
});

cron.schedule("* * * * *", async () => {
    try{
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); // Get tomorrow's date
        tomorrow.setHours(0, 0, 0, 0); // Start of the day
        const endOfTomorrow = new Date(tomorrow);
        endOfTomorrow.setHours(23, 59, 59, 999); // End of the day

        const upcomingEvents = await Calendar.find({
            date: { $gte: tomorrow, $lte: endOfTomorrow }, // Find events scheduled for tomorrow
            reminderSent: false,
        });
        
        for (const event of upcomingEvents) {
            console.log(`Reminder: Event "${event.title}" is starting soon!`);

            // Create and save a notification
            const notified = new Notification({
                message: `The event "${event.title}" is starting soon!`,
            });

            await notified.save();

            // Mark reminder as sent
            await Calendar.findByIdAndUpdate(event._id, { reminderSent: true });

            // ✅ (Optional) Send to Frontend (if using WebSockets or SSE)
            // io.emit("eventReminder", { message: notified.message }); // For WebSocket
        }
    }
    catch(error){
        console.log(error);
    }
});
module.exports = {
    createEvent,
    getAllEvents,
    deleteEvent,
};
