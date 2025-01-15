const mongoose = require('mongoose');

// Define the schema for the Job Listing
const jobListingSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isApproved: {
      type: Boolean,
      default: false,  // default to false if not explicitly set
    },
  jobImage: [
    {
      public_id: String,
      url: String,
    },
  ],
});

const JobListing = mongoose.model('JobListing', jobListingSchema);
module.exports = JobListing;
