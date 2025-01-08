// jobCreationController.js
const cloudinary = require("cloudinary");
const { getDataUri } = require("../utils/Features.js");


const jobCreation = require('../models/jobCreationModel.js'); // Assuming the Job Creation model

const createJob = async (req, res) => {
  try {
    // Extract the fields from the request body
    const { jobTitle, companyName, description, location, salary } = req.body;

    // Check if all required fields are provided
    if (!jobTitle || !companyName || !description || !location || !salary) {
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
      description,
      location,
      salary,
    
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




// Controller to fetch all job applications
const getAllJobsCreated = async (req, res) => {
  try {
    // Fetch all job applications from the database
    const jobCreations = await jobCreation.find();

    // Check if there are any job applications
    if (!jobCreations || jobCreations.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'No job created.',
      });
    }

    // Respond with a success message and the list of job applications
    res.status(200).send({
      success: true,
      message: 'Jobs created fetched successfully',
      jobCreations,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error fetching job applications',
      error: error.message,
    });
  }
};



module.exports = {
  createJob,
  getAllJobsCreated,
};
