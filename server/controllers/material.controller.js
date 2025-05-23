// const {} = require("mongoose");
const User = require("../models/user.model.js");
const Material = require("../models/material.model.js");
const Course = require("../models/course.model.js")
const Subject = require("../models/subject.model.js");
const Unit = require("../models/unit.model.js");
const Notifications = require("../models/notifications.model.js");
const ViewLater = require("../models/viewLater.model.js");
const asyncWrapper = require("../middlewares/async.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.utils.js");
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");
const mongoose = require("mongoose");

// done
// upload
const uploadMaterial = asyncWrapper(async (req, res) => {
    const { materialName, description } = req.body;
    const { courseName, subjectName, unitName } = req.params;

    const userId = req.user._id;
    const user = await User.findById(userId);
    const unit = await Unit.findOne({ unitname: unitName });
    if (!unit) {
        return res.status(404).json({ message: "Unit not found" });
    }

    const materialLocalPath = req.file?.path;

    // mimetype: 'image/png',
    // public_id: 'mjen25va26nb9nqr5o2x',
    // url: 'http://res.cloudinary.com/dcfvkgo4a/image/upload/v1733170343/mjen25va26nb9nqr5o2x.png',
    if (!materialLocalPath) {
        return res
            .status(400)
            .json({ message: "Material file local path required" });
    }

    const fileSize = req.file?.size;
    const material = await uploadOnCloudinary(materialLocalPath, fileSize);

    if (!material) {
      return res.status(400).json({ message: "Material file required" });
    }

    const owner = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "user",
            },
        },
        {
            $project: {
                password: 0,
                refreshToken: 0,
            },
        },
    ]);
    const newMaterial = new Material({
        materialname: materialName,
        description,
        course: courseName,
        subject: subjectName,
        unit: unitName,
        owner: owner[0].username,
        fileType: material.resource_type,
        materialURL: material.url,
        materialP_id: material.public_id,
    });
    await newMaterial.save();

    // make a entry in users notification
        const notified = new Notifications({
            message: "Please Publish This Material",
            messageBy: userId,
            material: newMaterial.materialname,
        });
    await notified.save();

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

    console.log(materialName)
    if (!(material.unit === unitName)) {
        return res
            .status(404)
            .json({ msg: `no material with name : ${materialName}` });
    }

    // add to viewHistory
    // get userId from req.user , after verifying
    const userId = req.user?._id;
    console.log(req.user)
    // find user in database;
    const user = await User.findById(userId);

    // get cloudinary url from mongodb database - material collection

    const materialname = material.materialname;

    // increment view counter for user
    material.views = (material.views || 0) + 1;
    await material.save();
    // push viewed material to viewHistory in user model
    user?.viewHistory.push({ materialId: materialName });
    await user?.save();
    console.log(userId);
    const found = await ViewLater.findOne({
        materialname: materialname,
        user: userId,
    });
    console.log(found)
    if (found) {
        user.viewCount = (user.viewCount || 0) + 1;
        await user.save();
    }
    // const agg = await Material.aggregate([
    //   {
    //     $match:
    //   }
    // ])

    res.status(200).json({ material });
});

// this function is for fetching all materials for searchbar results
const giveAllmaterials = asyncWrapper(async (req, res) => {
    const { limit = "6" } = req.query;
    const limitNumber = parseInt(limit, 10);
    const materials = await Material.find({ isPublished: true }).limit(
        limitNumber
    );
    res.status(200).json({ materials });
});

// done
// see all materials from an unit
const getAllMaterials = asyncWrapper(async (req, res) => {
    const { courseName, subjectName, unitName } = req.params;
    const {
        page = "1",
        limit = "2",
        sortBy = "coursename",
        SortType = "-1",
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const sortOrder = SortType === "1" ? 1 : -1;

    const pipeline = [];

    const materials = await Material.find({
        course: courseName,
        subject: subjectName,
        unit: unitName,
        isPublished: true,
    })
        .sort({ [sortBy]: sortOrder }) // Sorting
        .skip((pageNumber - 1) * limitNumber) // Pagination (skip previous pages)
        .limit(limitNumber);

    const totalMaterials = await Material.countDocuments();

    // if (query) {
    //   pipeline.push({
    //     $search: {
    //       index: "search-materials",
    //       text: {
    //         query: query,
    //         path: ["path", "description"],
    //       },
    //     },
    //   });
    // }

    // const material = await Material.aggregate([
    //   {
    //     $match: {
    //       unitname: "unitName",
    //     },
    //   },
    // ]);

    // const data = await Material.aggregate([{}]);
    res.status(200).json({
        materials,
        totalPages: Math.ceil(totalMaterials / limitNumber),
        currentPage: pageNumber,
    });
});

const getMaterialsByUser = asyncWrapper(async (req, res) => {
    const userId = req.user?.username;
    const materials = await Material.find({ owner: userId });
    res.status(200).json({ materials });
});

const getMaterialForStudent = asyncWrapper(async (req, res) => {
    const userId = req.user?.username;
    const materials = await Material.find({ owner: userId });
    res.status(200).json({ materials });
})

// test
// delete a material
const deleteMaterial = asyncWrapper(async (req, res) => {
    const { materialName } = req.params;

    const material = await Material.findById(materialName);
    if (!material) {
        return res.status(400).json({ message: "material not found" });
    }

    const userId = req.user?._id;
    if (material?.owner.toString() !== userId.toString()) {
        return res
            .status(400)
            .json({
                message: "You are not authorised to delete this material",
            });
    }
    const deletedMaterial = await Material.findByIdAndDelete(materialName);

    if (!deletedMaterial) {
        return res.status(400).json({ message: "Failed to delete material" });
    }

    // delete material from cloudinary
    //
    await SavedMaterial.deleteMany({ materialId: materialName });
    // const material = await Material.findOneAndDelete({
    //   materialname: materialName,
    // });
    if (!material) {
        return res
            .status(404)
            .json({ mag: `no material with id : ${materialName}` });
    }
    res.status(200).json({ message: "material deleted successfully" });
});

// update material name
const updateMaterial = asyncWrapper(async (req, res) => {
    const { materialName } = req.params;

    console.log(materialName);
    const material = await Material.findOneAndUpdate(
        { _id: materialName },
        {
          $set: {
              materialname: req.body.editMaterialname,
              description: req.body.editMaterialdescription,
              keywords: req.body.editMaterialkeywords,
          },
        },
        {
          new: true,
          runValidators: true,
        }
    );
    console.log(material);
    if (!material) {
        return res
            .status(404)
            .json({ message: `no material with id : ${materialName}` });
    }
    res.status(200).json({ material });
});

// this function is for toggling publish status for material
const togglePublishMaterial = asyncWrapper(async (req, res) => {
    const { notificationId } = req.params;
    try {
        const notification = await Notifications.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        const materialName = notification.material;

        const material = await Material.findOne({ materialname: materialName });
        if (!material) {
            return res.status(404).json({ message: "Material not found" });
        }
        const toggled = await Material.findByIdAndUpdate(
            material._id,
            { $set: { isPublished: !material.isPublished } },
            { new: true }
        );

        if (!toggled) {
            return res
                .status(500)
                .json({ message: "Could not change publish status" });
        }

        await Notifications.findByIdAndDelete(notificationId);

        const notifyStudents = new Notifications({
            message: "New Material Uploaded",
            material: material.materialname,
            messageBy: material.owner,
        });
        console.log(notifyStudents);
        await notifyStudents.save();

        res.status(200).json({
            success: true,
            message: "Material publish status toggled",
            material: toggled,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

const getMaterialStats = async (req, res) => {
    try {
        // Count published and unpublished materials
        const publishedCount = await Material.countDocuments({
            isPublished: true,
        });
        const unpublishedCount = await Material.countDocuments({
            isPublished: false,
        });

        res.status(200).json({
            success: true,
            totalPublished: publishedCount,
            totalUnpublished: unpublishedCount,
        });
    } catch (error) {
        console.error("Error fetching material stats:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const getData = asyncWrapper(async (req, res)=>{
    const courseCount = await Course.countDocuments({});
    const subjectCount = await Subject.countDocuments({});
    const unitCount = await Unit.countDocuments({});
    const materialCount = await Material.countDocuments({});
    const userCount = await User.countDocuments({});
    const publishedMaterialCount = await Material.countDocuments({isPublished: true});
    const notPublishedMaterialCount = await Material.countDocuments({isPublished : false});
    res.status(200).json({courseCount, subjectCount, unitCount, materialCount, userCount, publishedMaterialCount, notPublishedMaterialCount});
})

module.exports = {
    uploadMaterial,
    displayMaterial,
    getAllMaterials,
    getMaterialsByUser,
    getMaterialForStudent,
    deleteMaterial,
    updateMaterial,
    giveAllmaterials,
    togglePublishMaterial,
    getMaterialStats,
    getData,
};
