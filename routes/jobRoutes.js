// jobRoutes.js

const express = require('express');
const router = express.Router();
const {appdeleteJobListing, appupdateApprovalStatus, getAllJobApplications, createJobApplication } = require('../controllers/jobApplicationController.js');
const {deleteJobListing, updateApprovalStatus, createJob, getAllJobsCreated } = require('../controllers/jobCreationController.js');
const { singleUpload, multipleUpload } = require('../middlewares/multer.js');
// Route for creating a job application
router.post('/create/application', multipleUpload, createJobApplication);
// Route for fetching all job applications
router.get("/all", getAllJobApplications);
router.patch('/:id/app-status', appupdateApprovalStatus)
router.delete('/deleteapp/:id', appdeleteJobListing)



// Route for creating a job posting
router.post('/create-job', multipleUpload, createJob);
router.get("/all-jobs", getAllJobsCreated);

router.patch('/:id/approve', updateApprovalStatus)
router.delete('/delete/:id', deleteJobListing)




module.exports = router;
