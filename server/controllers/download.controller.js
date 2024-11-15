const Material = require('../models/material.model');
const {} = require('mongoose');
const asyncWrapper = require('../middlewares/async');

const downloadMaterial = asyncWrapper(async (req, res) => {

    res.status(200).json({
        msg: 'downloaded successfully'
    })
})

module.exports = {downloadMaterial};
