const express = require('express');
const router = express.Router();
const {createSubject, getSubject, getAllSubjects, deleteSubject, updateSubject} = require('../controllers/subject.controller');
const {createCourse, getCourse, getAllCourses, deleteCourse, updateCourse} = require('../controllers/course.controller');
const {createUnit, getAllUnits, getUnit, deleteUnit, updateUnit} = require('../controllers/unit.controller');

router.route('/').get(getAllCourses).post(createCourse)
router.route('/:id').get(getCourse).patch(updateCourse).delete(deleteCourse)
router.route('/:id/subject').post(createSubject).get(getAllSubjects)
router.route('/:id/subject/:id').get(getSubject).patch(updateSubject).delete(deleteSubject)
router.route('/:id/subject/:id/unit').post(createUnit).get(getAllUnits)
router.route('/:id/subject/:id/unit/:id').get(getUnit).patch(updateUnit).delete(deleteUnit)

module.exports = router;