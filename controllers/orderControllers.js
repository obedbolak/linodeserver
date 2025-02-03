// controllers/orderController.js
const Order = require('../models/orderModels.js');



const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();  // Retrieves all orders from the database
        res.status(200).json(orders);  // Sends the list of orders as a JSON response
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching orders', error: err });
    }
};



// Create a new order
const createOrder = async (req, res) => {
    try {
        const orderData = req.body;
        const order = new Order(orderData);
        await order.save();
        res.status(201).json({ message: 'Order created successfully', order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating order', error: err });
    }
};

// Get an order by UID
const getOrderByUid = async (req, res) => {
    try {
        const { Uid } = req.params;
        const order = await Order.findOne({ Uid });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching order', error: err });
    }
};

// Update an order by UID (if required)
const updateOrder = async (req, res) => {
    try {
        const { Uid } = req.params;
        const order = await Order.findOneAndUpdate({ Uid }, req.body, { new: true });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order updated successfully', order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating order', error: err });
    }
};

// Delete an order by UID
const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params; // Assuming orderId is passed in the params

        // Find and delete the order by _id
        const order = await Order.findOneAndDelete({ _id: orderId });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found for the provided _id' });
        }

        res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (err) {
        console.error('Error details:', err); // Log detailed error
        res.status(500).json({ success: false, message: 'Error deleting order', error: err.message });
    }
};


const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params; // Get order ID from route parameters
    const { orderStatus } = req.body; // Get new status from request body

    // Validate that the new status is valid
    const validStatuses = ["processing", "shipped", "delivered"];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    // Find and update the order status
    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true, runValidators: true } // return updated order and validate
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    return res.status(200).json({
      message: 'Order status updated successfully',
      order: order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


// Assuming this is in your controller or route handler
const updatePaymentStatus = async (orderId) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        'paymentInfo.status': 'paid'
      },
      { new: true } // This option returns the updated document
    );

    if (!updatedOrder) {
      throw new Error('Order not found');
    }

    return updatedOrder;
  } catch (error) {
    throw error;
  }
};


module.exports = {
    createOrder,
    getOrderByUid,
    updateOrder,
    deleteOrder,
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
};
