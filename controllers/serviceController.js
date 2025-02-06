const Service = require("../models/serviceModel.js");
const cloudinary = require("cloudinary"); // Cloudinary for image deletion
const { getDataUri } = require("../utils/Features.js");

// Controller to create a new service
const createService = async (req, res) => {
  try {
    const { name, description, location, contactInfo, email, status, locationCity } = req.body;

    // Validate required fields
    if (!name || !description || !location || !contactInfo || !email) {
      return res.status(400).send({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if images were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Please provide service images",
      });
    }

    // Initialize an array to hold image data
    const imagesArray = [];

    // Loop through each uploaded file (image)
    for (let file of req.files) {
      const fileUri = getDataUri(file); // Convert file to Data URI
      const cdb = await cloudinary.uploader.upload(fileUri.content); // Upload to Cloudinary

      const image = {
        public_id: cdb.public_id,
        url: cdb.secure_url,
      };

      // Add the image data to the array
      imagesArray.push(image);
    }

    // Create the new service in the database
    const newService = new Service({
      name,
      description,
      location,
      contactInfo,
      email,
      locationCity,
      status: status || "active", // Default to "active" if no status is provided
      images: imagesArray, // Save the image data
    });

    await newService.save(); // Save the service to the database

    // Return success response
    res.status(201).send({
      success: true,
      message: "Service created successfully",
      service: newService,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating the service",
      error: error.message,
    });
  }
};

// Controller to delete a service by ID
const deleteService = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the route parameter

    // Find the service in the database
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).send({
        success: false,
        message: "Service not found",
      });
    }

    // Delete images from Cloudinary
    for (let image of service.images) {
      await cloudinary.uploader.destroy(image.public_id); // Delete the image by public ID
    }

    // Delete the service from the database
    await Service.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting the service",
      error: error.message,
    });
  }
};

// Controller to fetch all services
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find(); // Get all services from the database
    res.status(200).send({
      success: true,
      services: services,
   });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching services",
      error: error.message,
    });
  }
};



// Toggle service status between active and inactive
const toggleServiceStatus = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findById(serviceId);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Toggle the status
    service.status = service.status === 'active' ? 'inactive' : 'active';
    
    await service.save();

    res.status(200).json({
      success: true,
      message: `Service status updated to ${service.status}`,
      service
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating service status',
      error: error.message
    });
  }
};

// Update approval status
const updateApprovalStatus = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { isApproved } = req.body;

    if (typeof isApproved !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isApproved must be a boolean value'
      });
    }

    const service = await Service.findByIdAndUpdate(
      serviceId,
      { isApproved },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Service approval status updated to ${isApproved}`,
      service
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating approval status',
      error: error.message
    });
  }
}; 


module.exports = { createService, deleteService, getAllServices, toggleServiceStatus ,updateApprovalStatus };
