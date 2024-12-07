// const {} = require("mongoose");
const User = require("../models/user.model.js");
const Material = require("../models/material.model.js");
const Unit = require("../models/unit.model.js");
const asyncWrapper = require("../middlewares/async.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.utils.js");
const {v2: cloudinary} = require("cloudinary");
const fs = require("fs");

// done
// upload
const createMaterial = asyncWrapper(async (req, res) => {

  const { materialName, description } = req.body;
  const { courseName, subjectName, unitName } = req.params;
 
  const unit = await Unit.findOne({ unitname: unitName });
  if (!unit) {
    return res.status(404).json({ error: "Unit not found" });
  }

  const materialLocalPath = req.file?.path;
  const fileSize = req.file?.size;
  console.log(req.file.mimetype)
  console.log(fileSize);
  // mimetype: 'image/png',
  // public_id: 'mjen25va26nb9nqr5o2x',
  // url: 'http://res.cloudinary.com/dcfvkgo4a/image/upload/v1733170343/mjen25va26nb9nqr5o2x.png',
  if (!materialLocalPath) {
    res.status(400).json({ message: "Material file local path required" });
  }

  
  console.log(materialLocalPath)
  const material = await uploadOnCloudinary(materialLocalPath, fileSize);
  
  if (!material) {
    res.status(400).json({ message: "Material file required" });
  }
  console.log(material)

  const newMaterial = new Material({
    materialname: materialName,
    description,
    course: courseName,
    subject: subjectName,
    unit: unitName,
    materialURL: material.url,
  });
  await newMaterial.save();

  // Add the subject to the course
  // unit.materials.push(newMaterial._id);
  // await unit.save();
  res.status(201).json({ newMaterial, message: "Material uploaded" });
});

// this function is for getting a file from the cloud
// done
// get access to it
const displayMaterial = asyncWrapper(async (req, res) => {
  const { unitName, materialName } = req.params;
  const material = await Material.findById(materialName);

  if (!(material.unit === unitName)) {
    return res
      .status(404)
      .json({ msg: `no material with name : ${materialName}` });
  }

  // add to viewHistory
  // get userId from req.user , after verifying
  const userId = req.user._id;
  // find user in database;
  const user = await User.findById(userId);
  console.log(user);

  // get cloudinary url from mongodb database - material collection

  // cloudinary.api.resource('nos0vbeq4twj2dhdbcjv', (error, result) => {
  //   if (error) {
  //     console.error('Error fetching image:', error);
  // } else {
  //     console.log('Image Details:', result);
  //     console.log('Image URL:', result.secure_url); // The direct URL to the image
  // }
  // })

  // increment view counter 
  material.views = (material.views || 0) + 1;
  await material.save();
  // push viewed material to viewHistory in user model
  user.viewHistory.push({materialId: materialName});
  await user.save();

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
  // material.url for the url from cloudinary material

  // const result = await cloudinary.api.resource(publicId);
  // const resourceType = result.resource_type;
  // if(resourceType == 'video'){
  //
  //
  // }
});

// done
// see all materials
const getAllMaterials = asyncWrapper(async (req, res) => {
  const { courseName, subjectName, unitName } = req.params;
  const materials = await Material.find({
    course: courseName,
    subject: subjectName,
    unit: unitName,
  });

  const data = await Material.aggregate([
    {
      
    }
  ])
  res.status(200).json({ materials: materials });
});

// delete a material
const deleteMaterial = asyncWrapper(async (req, res) => {
  const { materialName } = req.params;
  const material = await Material.findOneAndDelete({
    materialname: materialName,
  });
  if (!material) {
    return res
      .status(404)
      .json({ mag: `no material with id : ${materialName}` });
  }
  res.status(200).json({ material });
});

// update material name
const updateMaterial = asyncWrapper(async (req, res) => {
  const { id: materialId } = req.params;

  const material = await Material.findOneAndUpdate(
    { _id: materialId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!material) {
    return res.status(404).json({ mag: `no material with id : ${materialId}` });
  }
  res.status(200).json({ material });
});

module.exports = {
  createMaterial,
  displayMaterial,
  getAllMaterials,
  deleteMaterial,
  updateMaterial,
};
