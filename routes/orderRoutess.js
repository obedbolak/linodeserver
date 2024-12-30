// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderControllers.js');

// Route to create a new order
router.post('/orders', orderController.createOrder);

// Route to get an order by UID
router.get('/orders/:Uid', orderController.getOrderByUid);

// Route to update an order by UID
router.put('/orders/:Uid', orderController.updateOrder);

// Route to delete an order by UID
router.delete('/orders/:Uid', orderController.deleteOrder);

module.exports = router;
