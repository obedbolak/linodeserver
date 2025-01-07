// jobRoutes.js

const express = require('express');
const router = express.Router();
const { createJobApplication } = require('../controllers/jobApplicationController.js');
const { createJob } = require('../controllers/jobCreationController.js');

// Route for creating a job application
router.post('/create-job-application', createJobApplication);

// Route for creating a job posting
router.post('/create-job', createJob);

module.exports = router;
