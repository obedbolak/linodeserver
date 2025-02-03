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


// Controller to fetch all job applications
const getAllJobApplications = async (req, res) => {
  try {
    // Fetch all job applications from the database
    const jobApplications = await jobApplicationModel.find();

    // Check if there are any job applications
    if (!jobApplications || jobApplications.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'No job applications found.',
      });
    }

    // Respond with a success message and the list of job applications
    res.status(200).send({
      success: true,
      message: 'Job applications fetched successfully',
      jobApplications,
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



const  appupdateApprovalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    // Validate isApproved is a boolean
    if (typeof isApproved !== 'boolean') {
      return res.status(400).json({ 
        message: 'Invalid approval status. Must be a boolean' 
      });
    }

    const updatedItem = await jobApplicationModel.findByIdAndUpdate(
      id, 
      { isApproved }, 
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Lost item not found' });
    }

    res.status(200).json({
      message: 'Item approval status updated successfully',
      item: updatedItem
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating approval status', 
      error: error.message 
    });
  }
};


const appdeleteJobListing = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedJob = await jobApplicationModel.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job listing deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};





module.exports = {
  createJobApplication,
  getAllJobApplications,
 appupdateApprovalStatus,
 appdeleteJobListing,
};

