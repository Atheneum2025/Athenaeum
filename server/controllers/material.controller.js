const { Storage } = require('@google-cloud/storage');
const Multer = require('multer');
const Stream = require('stream');
const fs = require('fs');
const path = require('path');
const Material = require('../models/material.model');
const Unit = require('../models/unit.model')
const { } = require('mongoose');
const asyncWrapper = require('../middlewares/async');

// done
const createMaterial = asyncWrapper(async (req, res) => {

    const { materialname, description } = req.body;
    const {courseName, subjectName, unitName} = req.params;
    console.log(unitName)
    const unit = await Unit.findOne({unitname : unitName});
    if (!unit) {
      return res.status(404).json({ error: 'Unit not found' });
    }
    // const subjects = await Subjects.create(req.body)
    console.log(req.body)
    const newMaterial = new Material({ materialname, description, course: courseName, subject: subjectName, unit: unitName });
    await newMaterial.save();

    // Add the subject to the course
    unit.materials.push(newMaterial._id);
    await unit.save();
    res.status(201).json({ newMaterial })

    //storage

    // const multer = Multer({
    //     storage: Multer.memoryStorage(),
    //     limit: {
    //         fileSize: 5 * 1024 * 1024
    //     },
    // })
    // let projectId = '';
    // let keyFileName = ''; 
    // const storage = new Storage({
    //     projectId,
    //     keyFileName
    // });

    // const bucket = storage.bucket('');

    // multer.single('imgFile', (req, res) => {
    //     try{
    //         if(req.file){
    //             const blob = bucket.file(req.file.originalname);
    //             const blobStream = blob.createWriteStream();

    //             blobStream.on('finish', () => {
    //                 re.status(200).send('Success');
    //             })
    //             blobStream.end(req.file.buffer);
    //         }
    //     }
    //     catch(err){
    //         res.status(500).send(err);
    //     }
    // })

})

// this function is for getting a file from the cloud
// done
const getMaterial = asyncWrapper(async (req, res) => {

    const {coursename, subjectname, unitName, materialName} = req.params;
    const material = await Material.findOne({materialname: materialName })

    if (material.unit !== unitName) {
        return res.status(404).json({ msg: `no material with name : ${materialName}` })
    }

    // for video streaming
    // if(Material.fileType == 'video'){
    //     const videoPath = path.resolve(__dirname, 'video.mp4');
    //     const stat = fs.statSync(videoPath);
    //     const fileSize = stat.size;
    //     const range = req.headers.range;

    //     if(range){
    //         const parts = range.replace(/bytes=/, '').split('-');
    //         const start = parseInt(parts[0], 10);
    //         const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    //         if(start >= fileSize){
    //             res.status(416).send('requested range not satisfiable\n');
    //             return;
    //         }

    //         const chunkSize = end - start + 1;
    //         const file = fs.createReadStream(videoPath, {start, end});
    //         const headers = {
    //             'Content-Range': 'bytes ${start}-${end}/${fileSize}',
    //             'Accept-Ranges': 'bytes',
    //             'Content-Length': chunkSize,
    //             'Content-Type': 'video/mp4',
    //         };

    //         res.writeHead(206, headers);
    //         fs.createReadStream(videoPath).pipe(res);
    //     }
    // };
    res.status(200).json({ material })


})

// done
const getAllMaterials = asyncWrapper(async (req, res) => {

    const {courseName, subjectName, unitName} = req.params
    const materials = await Material.find({course: courseName, subject: subjectName, unit: unitName});
    res.status(200).json({ materials: materials });

})

const deleteMaterial = asyncWrapper(async (req, res) => {

    const { id: materialId } = req.params;
    const material = await Material.findOneAndDelete({ _id: materialId })
    if (!material) {
        return res.status(404).json({ mag: `no material with id : ${materialId}` })
    }
    res.status(200).json({ material });

})

const updateMaterial = asyncWrapper(async (req, res) => {

    const { id: materialId } = req.params;

    const material = await Material.findOneAndUpdate({ _id: materialId }, req.body, {
        new: true,
        runValidators: true
    })

    if (!material) {
        return res.status(404).json({ mag: `no material with id : ${materialId}` })
    }
    res.status(200).json({ material })

})

module.exports = { createMaterial, getMaterial, getAllMaterials, deleteMaterial, updateMaterial };