const userModel = require("../models/userModel.js");
const cloudinary = require("cloudinary");
const { getDataUri } = require("../utils/Features.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const registerController = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      address,
      city,
      country,
      phone,
      answer,
      storeName,
      businessAddress,
      businessDescription,
      businessPhone,
    } = req.body;

    // Validate input fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    // Check if the email or phone is already taken
    const existingUser = await userModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or phone number is already taken.",
      });
    }

    // Create a new user
    const user = new userModel({
      name,
      email,
      password,
      address,
      city,
      country,
      phone,
      answer,
      storeName,
      businessAddress,
      businessDescription,
      businessPhone,
    });

    // Save the user to the database
    await user.save();

    res.status(200).json({
      success: true,
      message: "Registration successful. Please log in.",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error during registration.",
      error,
    });
  }
};



//LOGIN

const loginController = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    // Find the user by email or phone
    const user = await userModel.findOne({
      $or: [{ email: loginId }, { phone: loginId }],
    });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: 'Invalid email/phone or password.',
      });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    // Generate JWT token
    const token = user.generateToken();

    // Send the token in a cookie and also in the response body
    res
      .status(200)
      .cookie('token', token, {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Cookie expires after 15 days
        secure: process.env.NODE_ENV === 'production', // Set 'secure' to true for production (HTTPS)
        httpOnly: true, // The cookie is not accessible via JavaScript
        sameSite: 'strict', // Prevents cross-site request forgery (CSRF) attacks
      })
      .send({
        success: true,
        message: 'Login Successful',
        token,
        user,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in Login API',
      error: error.message,
    });
  }
};




// GET USER PROFILE
const getUserProfileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "USer Prfolie Fetched Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In PRofile API",
      error,
    });
  }
};

// LOGOUT
const logoutController = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
        sameSite: process.env.NODE_ENV === "development" ? true : false,
      })
      .send({
        success: true,
        message: "Logout SUccessfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In LOgout API",
      error,
    });
  }
};

// UPDATE USER PROFILE
const updateProfileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { name, email, address, city, country, phone } = req.body;
    // validation + Update
    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (city) user.city = city;
    if (country) user.country = country;
    if (phone) user.phone = phone;
    //save user
    await user.save();
    res.status(200).send({
      success: true,
      message: "User Profile Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In update profile API",
      error,
    });
  }
};

// update user passsword
const udpatePasswordController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;
    //valdiation
    if (!oldPassword || !newPassword) {
      return res.status(500).send({
        success: false,
        message: "Please provide old or new password",
      });
    }
    // old pass check
    const isMatch = await user.comparePassword(oldPassword);
    //validaytion
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid Old Password",
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In update password API",
      error,
    });
  }
};

/// Update user profile photo
const updateProfilePicController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const file = getDataUri(req.file);

    // Check if the user has an existing profile picture
    if (user.profilePic && user.profilePic.public_id) {
      // Delete the previous image
      await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
    }

    // Upload the new profile picture
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    user.profilePic = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    // Save the updated user
    await user.save();

    res.status(200).send({
      success: true,
      message: "Profile picture updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update profile pic API",
      error,
    });
  }
};

// FORGOT PASSWORD
const passwordResetController = async (req, res) => {
  try {
    // user get email || newPassword || answer
    const { email, newPassword, answer } = req.body;
    // valdiation
    if (!email || !newPassword || !answer) {
      return res.status(500).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }
    // find user
    const user = await userModel.findOne({ email, answer });
    //valdiation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "invalid user or answer",
      });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Your Password Has Been Reset Please Login !",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In password reset API",
      error,
    });
  }
};

const fetchAdminUsersController = async (req, res) => {
  try {
    const adminUsers = await userModel.find({ role: "admin" });

    res.status(200).send({
      success: true,
      message: "Admin users fetched successfully",
      adminUsers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching admin users",
      error,
    });
  }
};

const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find().select("-password"); // Exclude password
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};
module.exports = {
  getAllUsersController,
  fetchAdminUsersController,
  registerController,
  loginController,
  getUserProfileController,
  passwordResetController,
  updateProfilePicController,
  udpatePasswordController,
  updateProfileController,
  logoutController,
};
