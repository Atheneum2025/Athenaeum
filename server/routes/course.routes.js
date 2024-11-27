const express = require('express');
const router = express.Router();
const {createSubject, getSubject, getAllSubjects, deleteSubject, updateSubject} = require('../controllers/subject.controller');
const {createCourse, getCourse, getAllCourses, deleteCourse, updateCourse} = require('../controllers/course.controller');
const {createUnit, getAllUnits, getUnit, deleteUnit, updateUnit} = require('../controllers/unit.controller');
const {createMaterial, getMaterial, getAllMaterials, deleteMaterial, updateMaterial} = require('../controllers/material.controller');

// with coursename
router.route('/').get(getAllCourses).post(createCourse)
router.route('/:courseName').get(getCourse).patch(updateCourse).delete(deleteCourse)
router.route('/:courseName/subject').post(createSubject).get(getAllSubjects)
router.route('/:courseName/subject/:subjectName').get(getSubject).patch(updateSubject).delete(deleteSubject)
router.route('/:courseName/subject/:subjectName/unit').post(createUnit).get(getAllUnits)
router.route('/:courseName/subject/:subjectName/unit/:unitName').get(getUnit).patch(updateUnit).delete(deleteUnit)
router.route('/:courseName/subject/:subjectName/unit/:unitName/material').post(createMaterial).get(getAllMaterials);
router.route('/:courseName/subject/:subjectName/unit/:unitName/material/:materialName').get(getMaterial).patch(updateMaterial).delete(deleteMaterial);

// with id
// router.route('/').get(getAllCourses).post(createCourse)
// router.route('/:courseId').get(getCourse).patch(updateCourse).delete(deleteCourse)
// router.route('/:courseId/subject').post(createSubject).get(getAllSubjects)
// router.route('/:courseId/subject/:subjectId').get(getSubject).patch(updateSubject).delete(deleteSubject)
// router.route('/:courseId/subject/:subjectId/unit').post(createUnit).get(getAllUnits)
// router.route('/:courseId/subject/:subjectId/unit/:unitId').get(getUnit).patch(updateUnit).delete(deleteUnit)
// router.route('/:courseId/subject/:subjectId/unit/:unitId/material').post(createMaterial).get(getAllMaterials);
// router.route('/:courseId/subject/:subjectId/unit/:unitId/material/:materialId').get(getMaterial).patch(updateMaterial).delete(deleteMaterial);

module.exports = router;