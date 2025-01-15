const mongoose = require('mongoose');

// Job Application Schema (Case 1)
const jobApplicationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  middleName: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  jobType: { type: String, required: true },
  briefWhy: { type: String, required: true },
  yearsExperience: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
   isApproved: {
      type: Boolean,
      default: false,  // default to false if not explicitly set
    },

images: [
    {
      public_id: String,
      url: String,
    },
  ],
});


const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

module.exports = JobApplication;
