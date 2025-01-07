// jobRoutes.js

const express = require('express');
const router = express.Router();
const { createJobApplication } = require('../controllers/jobApplicationController.js');
const { createJob } = require('../controllers/jobCreationController.js');
const { singleUpload, multipleUpload } = require('../middlewares/multer.js');
// Route for creating a job application
router.post('/create/application', multipleUpload, createJobApplication);

// Route for creating a job posting
router.post('/create-job', multipleUpload, createJob);

module.exports = router;
