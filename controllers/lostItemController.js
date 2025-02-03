
const lostItem = require("../models/lostItemModel.js");

const cloudinary = require("cloudinary");
const { getDataUri } = require("../utils/Features.js");







const createLostItem = async (req, res) => {
try {
    const { itemName, description, location, status, contactInfo } = req.body;

    // Validation for required fields (if needed)
    if (!itemName || !description || !location || !status || !contactInfo) {
      return res.status(400).send({
        success: false,
        message: "Please provide all required fields",
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
    const newProduct = await lostItem.create({
      itemName, description, location, status, contactInfo,
      images: imagesArray, // Save the array of image links
    });

    // Return a success response
    res.status(201).send({
      success: true,
      message: "item  created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating the item",
      error: error.message,
    });
  }
};     	     





const updateLostItem = async (req, res) => {
  try {
    const item = await lostItemModel.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    let imagesArray = item.images;
    if (req.files) {
      // Delete old images
      for (const image of item.images) {
        await cloudinary.v2.uploader.destroy(image.public_id);
      }

      // Upload new images
      imagesArray = [];
      for (let file of req.files) {
        const fileUri = getDataUri(file);
        const cdb = await cloudinary.v2.uploader.upload(fileUri.content);
        imagesArray.push({
          public_id: cdb.public_id,
          url: cdb.secure_url,
        });
      }
    }

    const updatedItem = await lostItemModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images: imagesArray },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteLostItem = async (req, res) => {
  try {
    const item = await lostItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    for (const image of item.images) {
      await cloudinary.v2.uploader.destroy(image.public_id);
    }

    await item.deleteOne();
    res.status(200).json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



const getAllLostItems = async (req, res) => {
  try {
    // Fetch all lost items from the database
    const items = await lostItem.find();

    // If no items are found, return a message indicating that
    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No lost items found",
      });
    }

    // If items are found, return them in the response
    res.status(200).json({
      success: true,
      message: "Lost items retrieved successfully",
      items,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error retrieving lost items",
      error: error.message,
    });
  }
};

const updateItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['lost', 'found'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be "lost" or "found"' 
      });
    }

    const updatedItem = await lostItem.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Lost item not found' });
    }

    res.status(200).json({
      message: 'Item status updated successfully',
      item: updatedItem
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating item status', 
      error: error.message 
    });
  }
};

// Update item approval status
const updateApprovalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    // Validate isApproved is a boolean
    if (typeof isApproved !== 'boolean') {
      return res.status(400).json({ 
        message: 'Invalid approval status. Must be a boolean' 
      });
    }

    const updatedItem = await lostItem.findByIdAndUpdate(
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




module.exports = {
  createLostItem,
  updateLostItem,
  getAllLostItems,
  deleteLostItem,
  updateItemStatus,
  updateApprovalStatus,
};
