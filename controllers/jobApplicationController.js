const jobApplicationModel = require("../models/jobApplicationModel.js");

const cloudinary = require("cloudinary");
const { getDataUri } = require("../utils/Features.js");

const createJobApplication = async (req, res) => {
  try {
    // Extract the fields from the request body
    const { firstName, middleName, lastName, jobType, briefWhy, yearsExperience, gender, email, phone } = req.body;

    // Check if the required fields are provided
    if (!firstName ) {
      return res.status(400).send({
        success: false,
        message: 'Please provide all required fields',
      });
    }

      if (!req.files || req.files.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Please provide product images",
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

    // Create the product in the database
    const newJobApplication = await jobApplicationModel.create({
     firstName, middleName, lastName, jobType, briefWhy, yearsExperience, gender, email, phone, images: imagesArray, // Save the array of image links
    });


    // Respond with a success message and the created job application
    res.status(201).send({
      success: true,
      message: 'Job application submitted successfully',
      jobApplication: newJobApplication,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error submitting the job application',
      error: error.message,
    });
  }
};

module.exports = {
  createJobApplication,
};

