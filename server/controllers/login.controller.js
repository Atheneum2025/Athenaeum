const User = require('../models/user.model');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// This controller function checks if the user is a valid user or not

const logInUser = async (req, res) => {
    const { username, password, role } = req.body;

// username can be repeated , changes to be done later
// email will be unique to all
// signUp will be through email and password only

    try {
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        if (role === 'admin') {
            // Admin-specific logic

            // res.json({ token });
            let options = {
                maxAge: 20 * 60 * 1000, // would expire in 20minutes
                httpOnly: true, // The cookie is only accessible by the web server
                secure: true,
                sameSite: "None",
            };
            const token = user.generateAccessJWT(); // generate session token for user
            res.cookie("SessionID", token, options); // set the token to response header, so that the client sends it back on each subsequent request
            res.status(200).json({
                status: "success",
                message: "You have successfully logged in.",
                
            });
        }
        else if (role === 'professor') {
            // Admin-specific logic
            let options = {
                maxAge: 20 * 60 * 1000, // would expire in 20minutes
                httpOnly: true, // The cookie is only accessible by the web server
                secure: true,
                sameSite: "None",
            };
            const token = user.generateAccessJWT(); // generate session token for user
            res.cookie("SessionID", token, options); // set the token to response header, so that the client sends it back on each subsequent request
            res.status(200).json({
                status: "success",
                message: "You have successfully logged in.",
                
            });

            // res.json({ token });
        } 
        else {
            // User-specific logic
            let options = {
                maxAge: 20 * 60 * 1000, // would expire in 20minutes
                httpOnly: true, // The cookie is only accessible by the web server
                secure: true,
                sameSite: "None",
            };
            const token = user.generateAccessJWT(); // generate session token for user
            res.cookie("SessionID", token, options); // set the token to response header, so that the client sends it back on each subsequent request
            res.status(200).json({
                status: "success",
                message: "You have successfully logged in.",
                
            });

            // res.json({ token });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

module.exports = {
    logInUser
}