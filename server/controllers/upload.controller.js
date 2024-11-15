const Material = require('../models/material.model');
const {} = require('mongoose');
// const asyncWrapper = require('../middlerwares/async');

const uploadMaterial = ()=>{
    res.status(200).json({
        msg: 'uploaded successfully'
    })
}

module.exports = {uploadMaterial};