// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderControllers.js');



router.get('/all-orders', orderController.getAllOrders);


// Route to create a new order
router.post('/orders', orderController.createOrder);

// Route to update order status (use PUT for updates)
router.put('/orders/:orderId/status', orderController.updateOrderStatus);  // Updated to PUT



// Route to get an order by UID
router.get('/orders/:Uid', orderController.getOrderByUid);

// Route to update an order by UID
router.put('/orders/:Uid', orderController.updateOrder);

// Route to delete an order by UID
router.delete('/orders/:orderId', orderController.deleteOrder);
// Route to update the payment status
router.put('/update-payment-status/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const updatedOrder = await orderController.updatePaymentStatus(orderId);
    res.status(200).json({
      message: 'Payment status updated successfully',
      updatedOrder
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
