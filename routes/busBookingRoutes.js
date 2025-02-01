const express = require('express');
const {createBooking, getBookings } = require("../controllers/busBookingController.js")
const router = express.Router();
const Booking = require("../models/busBookingModel.js")

router.get("/get-bookings", getBookings);
router.post('/bookings', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ 
      message: 'Booking creation failed', 
      error: error.message 
    });
  }
});
router.post("/create", createBooking);

module.exports = router;
