// jobCreationController.js
const cloudinary = require("cloudinary");
const { getDataUri } = require("../utils/Features.js");


const jobCreation = require('../models/jobCreationModel.js'); // Assuming the Job Creation model

const createJob = async (req, res) => {
  try {
    // Extract the fields from the request body
    const { jobTitle, companyName, jobDescription, location, salary, requirements } = req.body;

    // Check if all required fields are provided
    if (!jobTitle || !companyName || !jobDescription || !location || !salary) {
      return res.status(400).send({
        success: false,
        message: 'Please provide all required fields',
      });
    }


	if (!req.files || req.files.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Please provide images",
      });
    }
	 // Initialize an array to hold image data
    const imagesArray = [];

    // Loop through each file uploaded
    for (let file of req.files) {
      const fileUri = getDataUri(file); // Convert file to Data URI
      const cdb = await cloudinary.v2.uploader.upload(fileUri.content); // Upload to Cloudinary

      const image = {
        public_id: cdb.public_id,
        url: cdb.secure_url,
      };

      // Add the image to the array
      imagesArray.push(image);
    }



    // Create the new job posting in the database
    const newJobPosting = await jobCreation.create({
      jobTitle,
      companyName,
      jobDescription,
      location,
      salary,
      requirements,
      jobImage: imagesArray,	 // Optional, can be an array of strings
    });

    // Respond with the created job posting
    res.status(201).send({
      success: true,
      message: 'Job created successfully',
      job: newJobPosting,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in creating the job posting',
      error: error.message,
    });
  }
};

module.exports = {
  createJob,
};
