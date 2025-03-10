const express = require('express');
const router = express.Router();
const { singleUpload, multipleUpload } = require('../middlewares/multer.js');
const { createProperty, getAllProperties, deleteProperty,updateProperty } = require("../controllers/propertyControllers.js");


router.post("/property", multipleUpload, createProperty); // Limit 5 images max
router.get("/properties", getAllProperties);
router.delete("/property/:id", deleteProperty);
router.put("/property/:id", updateProperty);


module.exports = router;
