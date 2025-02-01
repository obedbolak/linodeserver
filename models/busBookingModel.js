const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  branch: { 
    type: String, 
    required: [true, 'Branch is required'] 
  },
  destination: { 
    type: String, 
    required: [true, 'Destination is required'] 
  },
  selectedSeats: { 
    type: [Number], 
    required: [true, 'Selected seats are required'] 
  },
  totalSeats: { 
    type: Number, 
    required: [true, 'Total seats are required'] 
  },
  selectedMonth: { 
    type: String, 
    required: [true, 'Month is required'] 
  },
  selectedDay: { 
    type: Number, 
    required: [true, 'Day is required'] 
  },
  selectedTime: { 
    type: String, 
    required: [true, 'Time is required'] 
  },
  fullName: { 
    type: String, 
    required: [true, 'Full name is required'] 
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'] 
  },
  idDocument: { 
    type: String, 
    enum: ['NIC', 'Passport', 'Professional Card', 'none'],
    required: [true, 'ID document type is required'] 
  },
  paymentMethod: { 
    type: String, 
    required: [true, 'Payment method is required'] 
  },
  totalPrice: { 
    type: Number, 
    required: [true, 'Total price is required'] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
