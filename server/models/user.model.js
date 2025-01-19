const mongoose = require("mongoose");
const Material = require("../models/material.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const viewHistorySchema = new mongoose.Schema({
  materialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Material",
    required: true,
  },
  openedAt: {
    type: Date,
    default: Date.now,
  },
});



const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "must provide name"],
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "professor", "admin"],
      default: "student",
      required: false,
    },
    viewHistory: [viewHistorySchema],
    permissions: {
      type: [String],
      default: ["upload", "download", "watch", "read"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.pre("findOneAndUpdate", async function (next) {
  const userId = this.getQuery().username;
  const updateData = this.getUpdate();

  const newUserName = updateData.username;

  console.log(userId);
  await Material.updateMany(
    { uploadedBy: userId },
    { $set: { uploadedBy: newUserName } }
  );
});

UserSchema.methods.generateAccessToken = function () {
  let payload = {
    _id: this._id,
  };
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

module.exports = mongoose.model("User", UserSchema);
