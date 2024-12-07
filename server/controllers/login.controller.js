const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncWrapper = require("../middlewares/async.js");

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    res.status(500).json({
      message: "something went wrong while generating access and refresh token",
    });
  }
};
// This controller function checks if the user is a valid user or not

const logInUser = async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body)
  if (!(username || password)) {
    return res.status(400).json({message: "username and password are required"});
  }
  // username can be repeated , changes to be done later
  // email will be unique to all
  // signUp will be through email and password only

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // checking if password is correct or not
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid user credentials" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
    // console.log(user._id);
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    // console.log(loggedInUser);
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        user: loggedInUser,
        accessToken,
        refreshToken,
        message: "User Logged in successfully",
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({msg : "Server error"});
  }
};

const logoutUser = asyncWrapper(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ message: "User Logged Out" });
});

const refreshAccessToken = asyncWrapper(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json({ message: "unauthoriased request" });
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      res.status(401).json({ message: "invalid refresh token" });
    }

    if (incomingRefreshToken !== user.refreshToken) {
      res.status(401).json({
        message: "refresh token is expired or used",
      });
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json({
        accessToken,
        refreshToken: newRefreshToken,
        message: "access token refreshed",
      });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
});

const changeCurrentPassword = asyncWrapper(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordCorrect) {
    res.status(400).json({ message: "Invalid old password" });
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res.status(200).json({ message: "Password changed" });
});

module.exports = {
  logInUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
};
