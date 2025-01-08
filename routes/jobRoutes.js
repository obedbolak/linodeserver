// jobRoutes.js

const express = require('express');
const router = express.Router();
const {getAllJobApplications, createJobApplication } = require('../controllers/jobApplicationController.js');
const { createJob, getAllJobsCreated } = require('../controllers/jobCreationController.js');
const { singleUpload, multipleUpload } = require('../middlewares/multer.js');
// Route for creating a job application
router.post('/create/application', multipleUpload, createJobApplication);
// Route for fetching all job applications
router.get("/all", getAllJobApplications);




// Route for creating a job posting
router.post('/create-job', multipleUpload, createJob);
router.get("/all-jobs", getAllJobsCreated);




module.exports = router;
