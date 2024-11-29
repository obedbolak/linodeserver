const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MerchantSchema = new Schema({
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
  agreedToTerms: Boolean,
});

module.exports = mongoose.model("Merchant", MerchantSchema);
