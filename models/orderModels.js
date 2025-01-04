// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    Uid: {
        type: String,
        required: true,
    },
    itemPrice: {
        type: Number,
        required: true,
    },
    orderItems: [{
        image: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        product: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        sellerId: {
            type: String,
            required: true,
        },
    }],
    paymentInfo: {
        mobileMoneyName: {
            type: String,
            required: true,
        },
        mobileMoneyNumber: {
            type: String,
            required: true,
        },
        mobileMoneyProvider: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    shippingCharges: {
        type: Number,
        required: true,
    },
    shippingInfo: {
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
    },
    tax: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
   orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered"],
      default: "processing",
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
