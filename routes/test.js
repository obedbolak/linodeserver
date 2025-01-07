const express = require('express');
const router = express.Router();
const { singleUpload, multipleUpload } = require('../middlewares/multer.js');
const { createService, deleteService, getAllServices } = require("../controllers/serviceController.js");


router.post("/services", multipleUpload, createService); // Limit 5 images max

// Route to delete a service by ID
router.delete("/services/:id", deleteService); // Delete a service by ID

// Route to get all services
router.get("/services", getAllServices); // Fetch all services

module.exports = router;


