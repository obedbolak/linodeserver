const userModel = require("../models/userModel.js");
const cloudinary = require("cloudinary");
const { getDataUri } = require("../utils/Features.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "fuchuobedbol@gmail.com",
    pass: "dsyb nmjw avyu abti ",
  },
});


// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: "fuchuobedbol@gmail.com",
      to: email,
      subject: "Your OTP for Account Verification",
      html: `
        <h1>Account Verification</h1>
        <p>Your OTP for account verification is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
      `,
    });
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};


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



	 // Generate OTP
    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
   
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
      otp,
      otpExpiration,
      storeName,
      businessAddress,
      businessDescription,
      businessPhone,
    });


	


    // Save the user to the database

    await user.save();

	// Send OTP
    const emailSent = await sendOTPEmail(email, otp);
    if (!emailSent) {
      return res.status(500).send({ message: "Error sending OTP email" });
    }

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
    // Get the user based on the logged-in user
    const user = await userModel.findById(req.user._id);

    // Extract data from the request body (exclude name, email, phone, and role)
    const {
      address,
      city,
      country,
      storeName,
      businessAddress,
      businessDescription,
      businessPhone,
    } = req.body;

    // Validation and Update the user fields, excluding name, email, phone, and role
    if (address) user.address = address;
    if (city) user.city = city;
    if (country) user.country = country;
    if (storeName) user.storeName = storeName;
    if (businessAddress) user.businessAddress = businessAddress;
    if (businessDescription) user.businessDescription = businessDescription;
    if (businessPhone) user.businessPhone = businessPhone;

    // Save the updated user data
    await user.save();

    res.status(200).send({
      success: true,
      message: "User profile updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating profile",
      error: error.message,
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


const changeUserRole = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from route params

    // Ensure the logged-in user can only change their own role
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to change this user's role" });
    }

    // Check if the user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Change the user's role to admin (if the current role is user)
    if (user.role === 'user') {
      user.role = 'admin';
      await user.save();
      return res.status(200).json({ message: "Your role has been changed to admin", user });
    } else {
      return res.status(400).json({ message: "You are already an admin" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};




// Controller to update the isApproved field
const updateApprovalStatus = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from request params
    const { isApproved } = req.body; // Get isApproved status from request body

    // Validate isApproved value
    if (typeof isApproved !== 'boolean') {
      return res.status(400).json({ message: "isApproved must be a boolean" });
    }

    // Find the user by ID and update the isApproved field
    const user = await userModel.findByIdAndUpdate(
      userId, 
      { isApproved },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: `User approval status updated successfully`,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
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


// DELETE USER
const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from route params

    // Ensure the logged-in user can only delete their own account (or an admin can delete any user)
    if ( req.user.role !== 'administrator') {
      return res.status(403).json({ message: "You are not authorized to delete this user" });
    }

    // Find the user to delete
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user's profile picture from Cloudinary if it exists
    if (user.profilePic && user.profilePic.public_id) {
      await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
    }

    // Delete the user from the database
    await userModel.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error,
    });
  }
};




module.exports = {
  deleteUserController,
  changeUserRole,
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
  updateApprovalStatus,
};
