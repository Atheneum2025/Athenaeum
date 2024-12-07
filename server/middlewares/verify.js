const User = require('../models/user.model');
const jwt = require('jsonwebtoken')
const asyncWrapper = require('../middlewares/async.js')


const verifyJWT = asyncWrapper( async (req, res, next)=>{
    const token = req.cookies?.accessToken || req.headers["Authorisation"]?.replace("Bearer ", "")

    if(!token){
        res.status(401).json({message: "Unauthorised request"})
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

    if(!user){
        res.send(401).json({ message: "invalid access token"})
    }

    req.user = user;
    next();
})


const verifyAdmin = (req, res, next) => {
    try {
        const { role } = req.user; // we have access to the user object from the request
        // const { role } = user; // extract the user role
        // check if user has no advance privileges
        // return an unathorized response
        if (role !== "admin") {
            return res.status(401).json({
                status: "failed",
                message: "You are not authorized as a admin to view this page.",
            });
        }
        next(); // continue to the next middleware or function
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error lol",
        });
    }
}

const verifyProfessor = (req, res, next) => {
    try {
        const { role } = req.user; // we have access to the user object from the request
        // const { role } = user; // extract the user role
        // check if user has no advance privileges
        // return an unathorized response
        if (role !== "professor") {
            return res.status(401).json({
                status: "failed",
                message: "You are not authorized as a professor to view this page.",
            });
        }
        next(); // continue to the next middleware or function
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error lol",
        });
    }
}

const uploadPermission = async (req, res, next) => {
    try {
        const { userId, role } = req.user;

        const user = await User.findById(userId);
        console.log(user.permissions);
        
    } catch (error) {
        
    }
}

module.exports = {
    verifyAdmin,
    verifyProfessor,
    verifyJWT
}