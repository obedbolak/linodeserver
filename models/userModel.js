const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const nodemailer = require("nodemailer");


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email already taken"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, "password length should be greadter then 6 character"],
    },
    address: {
      type: String,
      required: [true, "address is required"],
    },
    city: {
      type: String,
      required: [true, "city name is required"],
    },
    country: {
      type: String,
      required: [true, "country name is required"],
    },
    phone: {
      type: String,
      required: [true, "phone no is required"],
    },
    profilePic: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    answer: {
      type: String,
      required: [true, "answer is required"],
    },
    role: {
      type: String,
      default: "user",
    },
	isApproved: {
      type: Boolean,
      default: false,  // default to false if not explicitly set
    },
    // Add OTP-related fields
    otp: {
      type: String,
    },
    otpExpiration: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,  // User is not verified by default
    },

 storeName: { type: String },
    businessAddress: { type: String },
    businessDescription: { type: String },
    businessPhone: { type: String },

  },

  { timestamps: true }
);

//fuynctuions
// hash func
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// compare function
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

//JWT TOKEN
userSchema.methods.generateToken = function () {
  return JWT.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};


// Generate OTP
userSchema.methods.generateOtp = function () {
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
  this.otp = otp;
  this.otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
  return otp;
};

// Send OTP to email
userSchema.methods.sendOtpEmail = async function () {
  const otp = this.generateOtp();

  const transporter = nodemailer.createTransport({
 	host: "smtp.gmail.com",
  port: 3000,
  secure: true,
  auth: {
    user: "fuchuobedbol@gmail.com",
    pass: "dsyb nmjw avyu abti ",
  },
  });

  const mailOptions = {
    from: '"One Market" <Support@onemarket.com>',
    to: this.email,
    subject: "OTP Verification for Your Account",
    html: `
      <h1>OTP Verification</h1>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>The OTP will expire in 5 minutes.</p>
    `,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

// Verify OTP
userSchema.methods.verifyOtp = function (otp) {
  if (this.otp !== otp) {
    return { isValid: false, message: "Invalid OTP" };
  }

  if (new Date() > new Date(this.otpExpiration)) {
    return { isValid: false, message: "OTP has expired" };
  }

  // Clear OTP after successful verification
  this.otp = null;
  this.otpExpiration = null;
  this.isVerified = true; // Mark the user as verified
  return { isValid: true, message: "OTP verified successfully" };
};



const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
