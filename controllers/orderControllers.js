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
        const { Uid } = req.params;
        const order = await Order.findOneAndDelete({ Uid });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting order', error: err });
    }
};

module.exports = {
    createOrder,
    getOrderByUid,
    updateOrder,
    deleteOrder,
    getAllOrders,
};
