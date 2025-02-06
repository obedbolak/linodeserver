const express = require('express');
const router = express.Router();
const { singleUpload, multipleUpload } = require('../middlewares/multer.js');
const { createProperty } = require("../controllers/propertyControllers.js");


router.post("/property", multipleUpload, createProperty); // Limit 5 images max

module.exports = router;
