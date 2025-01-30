const express = require('express');
const router = express.Router();
const { createSubject, getSubject, getAllSubjects, deleteSubject, updateSubject } = require('../controllers/subject.controller');
const { createCourse, getCourse, getAllCourses, deleteCourse, updateCourse } = require('../controllers/course.controller');
const { createUnit, getAllUnits, getUnit, deleteUnit, updateUnit } = require('../controllers/unit.controller');
const { uploadMaterial, displayMaterial, getAllMaterials, deleteMaterial, updateMaterial, togglePublishMaterial } = require('../controllers/material.controller');
const { toggleMaterialSave, getAllSavedMaterials } = require("../controllers/savedMaterial.controller.js")
const { upload } = require("../middlewares/multer.middleware.js")

const { verifyJWT, verifyProfessor, verifyAdmin } = require("../middlewares/verify.js")
// with coursename
router.route('/')
    .get(getAllCourses)
    .post(verifyJWT, createCourse)
router.route('/:courseName')
    .get(getCourse)
    .patch(updateCourse)
    .delete( deleteCourse)
router.route('/:courseName/subject')
    .post(verifyJWT ,createSubject)
    .get(getAllSubjects)
router.route('/:courseName/subject/:subjectName')
    .get(getSubject)
    .patch(updateSubject)
    .delete(deleteSubject)
router.route('/:courseName/subject/:subjectName/unit')
    .post(verifyJWT ,createUnit)
    .get(getAllUnits)
router.route('/:courseName/subject/:subjectName/unit/:unitName')
    .get(getUnit)
    .patch(updateUnit)
    .delete(deleteUnit)
router.route('/:courseName/subject/:subjectName/unit/:unitName/material')
    .post(verifyJWT, upload.single('file'), uploadMaterial)
    .get(getAllMaterials);
router.route('/:courseName/subject/:subjectName/unit/:unitName/material/:materialName')
    .get( displayMaterial)
    .patch(updateMaterial)
    .delete(deleteMaterial);
router.route('/:courseName/subject/:subjectName/unit/:unitName/material/:materialName/save')
    .post(verifyJWT, toggleMaterialSave)
    .get(getAllSavedMaterials);
// router.route('/:courseName/subject/:subjectName/unit/:unitName/material/:materialName/status')
//     .put(verifyJWT, togglePublishMaterial);
// coder coder dark
// synthwave
// cobalt2
// shades of purple


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