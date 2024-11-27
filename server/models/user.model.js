const mongoose = require('mongoose');
const Material = require('../models/material.model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        // required: [true, 'must provide name']
    },
    password: {
        type: String,
        // required: true
    },
    role: {
        type: String,
        enum: ['student', 'professor', 'admin'],
        default: 'student',
        required: false
    }

    },
    {
        timestamps: true
    }
)

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

UserSchema.pre('findOneAndUpdate', async function (next) {
    const userId = this.getQuery().username;
    const updateData = this.getUpdate();

    const newUserName = updateData.username;
    
    console.log(userId);
    await Material.updateMany({uploadedBy: userId}, { $set: {uploadedBy: newUserName}});
})

UserSchema.methods.generateAccessJWT = function () {
    let payload = {
      id: this._id,
    };
    return jwt.sign(payload, 'secretkey', {
      expiresIn: '60s',
    });
  };

module.exports = mongoose.model('User', UserSchema);