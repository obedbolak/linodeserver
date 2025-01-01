const express = require('express');
const router = express.Router();
const { singleUpload, multipleUpload } = require('../middlewares/multer.js');
const { 
  createLostItem,
  updateLostItem,
  deleteLostItem,
  } = require('../controllers/lostItemController.js');


// Protected routes
router.post('/item/new', multipleUpload, createLostItem);
router.put('/item/:id', multipleUpload, updateLostItem);
router.delete('/item/:id', deleteLostItem);

module.exports = router;
