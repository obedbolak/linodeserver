const Property = require("../models/propertyModels.js");
const cloudinary = require("cloudinary"); // Cloudinary for image deletion
const { getDataUri } = require("../utils/Features.js");


const createProperty = async (req, res) => {
  try {
    const { postName, postType, propertyState, description, location, contactInfo, email, locationCity, status } = req.body;

    // Validate required fields
    if (!postName || !description || !location || !contactInfo) {
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

      try {
        // Upload the image to Cloudinary
        const cdb = await cloudinary.uploader.upload(fileUri.content);

        const image = {
          public_id: cdb.public_id,
          url: cdb.secure_url,
        };

        // Add the image data to the array
        imagesArray.push(image);
      } catch (uploadError) {
        // Handle image upload failure
        console.error(`Error uploading image: ${uploadError.message}`);
        return res.status(500).send({
          success: false,
          message: `Error uploading image: ${uploadError.message}`,
        });
      }
    }

    // Create the new service (property) in the database
    const newProperty = new Property({
      postName,
      postType,
      propertyState,
      description,
      location,
      contactInfo,
      email,
      locationCity,
      status: status || "active", // Default to "active" if no status is provided
      images: imagesArray, // Save the image data
    });

    // Save the service to the database
    await newProperty.save();

    // Return success response
    res.status(201).send({
      success: true,
      message: "Service created successfully",
      service: newProperty,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in creating the service",
      error: error.message,
    });
  }
};

module.exports = { createProperty };
