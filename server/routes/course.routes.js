const express = require('express');
const router = express.Router();
const { createSubject, getSubject, getAllSubjects, deleteSubject, updateSubject } = require('../controllers/subject.controller');
const { createCourse, getCourse, getAllCourses,giveAllCourses, deleteCourse, updateCourse } = require('../controllers/course.controller');
const { createUnit, getAllUnits, getUnit, deleteUnit, updateUnit } = require('../controllers/unit.controller');
const { uploadMaterial, displayMaterial, getAllMaterials, deleteMaterial, updateMaterial, togglePublishMaterial } = require('../controllers/material.controller');
const { toggleMaterialSave, getAllSavedMaterials } = require("../controllers/savedMaterial.controller.js")
const { createViewLater, getAllViewLaters, deleteViewLater } = require("../controllers/viewLater.controller.js");
const {rateCourse, getRating} = require('../controllers/rating.controller.js');
const { upload } = require("../middlewares/multer.middleware.js")

const { verifyJWT, verifyProfessor, verifyAdmin } = require("../middlewares/verify.js")
// with coursename
router.route('/')
    .get(verifyJWT, getAllCourses)
    .post(verifyJWT, createCourse)
router.route('/c/')
    .get(giveAllCourses)
router.route('/:courseName')
    .get(getCourse)
    .patch(verifyJWT, updateCourse)
    .delete(verifyJWT, deleteCourse)
router.route('/:courseName/subject')
    .post(verifyJWT ,createSubject)
    .get(getAllSubjects)
router
  .route("/:courseName/subject/:subjectName")
  .get(getSubject)
  .patch(verifyJWT, updateSubject)
  .delete(verifyJWT, deleteSubject);
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
    .get(verifyJWT, displayMaterial)
    .patch(updateMaterial)
    .delete(deleteMaterial);
router.route("/:courseName/subject/:subjectName/unit/:unitName/material/:materialName/save")
  .get(getAllSavedMaterials)
  .post(verifyJWT, toggleMaterialSave);
router.route("/:courseName/subject/:subjectName/unit/:unitName/material/:materialName/viewLater")
  .post(verifyJWT, createViewLater)
router.route("/:courseName/subject/:subjectName/unit/:unitName/material/:materialName/viewLater/:viewLaterId")
  .delete(verifyJWT, deleteViewLater);
router.route("/:courseId/rate")
  .post(verifyJWT, rateCourse)
  .get(verifyJWT, getRating)
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