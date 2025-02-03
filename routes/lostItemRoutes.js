const express = require('express');
const router = express.Router();
const { singleUpload, multipleUpload } = require('../middlewares/multer.js');
const {
 getAllLostItems, 
  createLostItem,
  updateLostItem,
  deleteLostItem,
  updateItemStatus,
updateApprovalStatus,
  } = require('../controllers/lostItemController.js');


router.get("/lost-items", getAllLostItems);

// Protected routes
router.post('/item/new', multipleUpload, createLostItem);
router.put('/item/:id', multipleUpload, updateLostItem);
router.delete('/item/:id', deleteLostItem);
// Route to update item status
router.patch('/:id/status', updateItemStatus);

// Route to update approval status
router.patch('/:id/approve', updateApprovalStatus);




module.exports = router;
