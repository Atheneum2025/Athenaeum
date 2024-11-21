const mongoose = require('mongoose');
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

UserSchema.methods.generateAccessJWT = function () {
    let payload = {
      id: this._id,
    };
    return jwt.sign(payload, 'secretkey', {
      expiresIn: '60s',
    });
  };

module.exports = mongoose.model('User', UserSchema);