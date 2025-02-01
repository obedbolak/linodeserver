const Booking = require('../controllers/busBookingController.js');


// Express route handler
const createBooking = async (req, res) => {
  try {
    const bookingData = req.body;
    const newBooking = new Booking(bookingData);
    await newBooking.save();
    
    res.status(201).json({
      message: 'Booking created successfully',
      booking: newBooking
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Booking creation failed', 
      error: error.message 
    });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching bookings', 
      error: error.message 
    });
  }
};

module.exports = { Booking, createBooking, getBookings };
