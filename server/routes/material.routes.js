const express = require('express');
const router = express.Router();

const {createMaterial, getMaterial, getAllMaterials, deleteMaterial, updateMaterial} = require('../controllers/material.controller');

router.route('/upload').post(createMaterial);
router.route('/download').get(getMaterial);
router.route('/').get(getAllMaterials);
router.route('/:id').get(getMaterial).patch(updateMaterial).delete(deleteMaterial);

module.exports = router;