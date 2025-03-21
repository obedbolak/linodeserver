const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

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
    productPayments: { 
    type: Number, 
    enum: [1, 2, 3, 4], 
    default: 1 
  }

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





const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
