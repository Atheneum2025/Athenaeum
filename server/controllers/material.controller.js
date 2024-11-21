const { Storage } = require('@google-cloud/storage');
const Multer = require('multer');
const Stream = require('stream');
const fs = require('fs');
const path = require('path');
const Material = require('../models/material.model');
const { } = require('mongoose');
const asyncWrapper = require('../middlerware/async');


const createMaterial = asyncWrapper(async (req, res) => {

    const material = await Material.create(req.body);
    res.status(201).json({ material });

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

// this login is for getting a file from the cloud
const getMaterial = asyncWrapper(async (req, res) => {

    const { id: materialId } = req.params;
    console.log(materialId);
    const material = await Material.findOne({ _id: materialId });

    if (!material) {
        return res.status(404).json({ mag: `no material with id : ${materialId}` });
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
    res.status(200).json({ material });


})

const getAllMaterials = asyncWrapper(async (req, res) => {

    const materials = await Course.find({})
    res.status(200).json({ courses: materials });

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