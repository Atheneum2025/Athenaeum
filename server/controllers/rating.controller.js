const Courses = require("../models/course.model.js");
const Users = require("../models/user.model.js");
const Rating = require("../models/rating.model.js");
const asyncWrapper = require("../middlewares/async");
const {} = require("mongoose");

const rateCourse = asyncWrapper(async (req, res) => {
    const { courseId, rating } = req.body;
    const userId = req.user;
    const course = await Courses.findById(courseId);

    // Check if user has already rated this course
    let existingRating = await Rating.findOne({ courseId, userId });
    if (existingRating) {
        const previousRating = existingRating.rating;
        existingRating.rating = rating;
        await existingRating.save();

        course.ratingSum -= previousRating;
        course.ratingSum += rating;

        course.rating = parseFloat((course.ratingSum / course.totalRatings).toFixed(5));

        await course.save();
        return res.json({
            success: true,
            message: "Rating updated",
            rating: existingRating,
        });
    }

    // Save new rating
    const newRating = new Rating({ courseId, userId, rating });
    await newRating.save();
    
    course.totalRatings += 1;
    course.ratingSum += rating;

    course.rating = course.ratingSum / course.totalRatings;

    await course.save();

    res.json({ success: true, message: "Rating submitted", rating: newRating });
});

const getRating = asyncWrapper(async (req, res) => {
    const {courseId} = req.params;
    const userId = req.user._id;
    const ratings = await Rating.findOne({ courseId: courseId, userId: userId });

    res.json({ ratings });
});

module.exports = { rateCourse, getRating };
