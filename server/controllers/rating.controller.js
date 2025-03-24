const Courses = require("../models/course.model.js");
const Users = require("../models/user.model.js");
const Rating = require("../models/rating.model.js");
const asyncWrapper = require("../middlewares/async");
const {} = require("mongoose");

const rateCourse = asyncWrapper(async (req, res) => {
    console.log("rating");
    const { courseId, rating } = req.body;
    const userId = req.user;
    const course = await Courses.findById(courseId);

    // Check if user has already rated this course
    let existingRating = await Rating.findOne({ courseId, userId });
    if (existingRating) {
        console.log("yes");
        existingRating.rating = rating;
        await existingRating.save();

        course.totalRatings += 1;
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
    const courseId = req.params.courseId;
    const ratings = await Rating.find({ courseId });

    if (ratings.length === 0)
        return res.json({ success: true, averageRating: 0, ratings: [] });

    const averageRating =
        ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length;
    res.json({ success: true, averageRating, ratings });
});

module.exports = { rateCourse, getRating };
