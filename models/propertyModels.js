const mongoose = require("mongoose");

// Service Schema
const propertySchema = new mongoose.Schema({
  postName: {
    type: String,
    required: true,
  },
  postType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  contactInfo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  images: [
    {
      public_id: String,
      url: String,
    },
  ],
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active", // Default state is "active"
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }, 
  isApproved: {
      type: Boolean,
      default: false,  // default to false if not explicitly set
    },
   locationCity:{
   type:String,
   required: true,
   },
  propertyState:{
   type:String,
   required: true,
   }
});

const Property = mongoose.model("Property", propertySchema);
module.exports = Property;
