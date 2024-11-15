const User = require('../models/user.model');
const jwt = require('jsonwebtoken')

// This controller function takes user details and registers them to our website

const signUpUser = async (req, res)=>{
    const { username, password, role } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            username,
            password,
            role
        });

        await user.save();

        // const payload = { user: { id: user.id, role: user.role } };
        // const token = jwt.sign(payload, 'secretKey', { expiresIn: 3600 });

        res.json({ user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}




module.exports = {
    signUpUser
}