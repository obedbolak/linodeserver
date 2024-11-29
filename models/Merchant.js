const mongoose = require("mongoose");

// Merchant Schema
const merchantSchema = new mongoose.Schema({
  userId: String,
  storeName: String,
  fullName: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  zipCode: String,
  country: String,
  phoneNumber: String,
  description: String,
  businessType: String,
  website: String,

  agreedToTerms: Boolean,
});
const Merchant = mongoose.model("Merchant", merchantSchema);
module.exports = Merchant;
