const express = require("express");
const router = express.Router();
const Merchant = require("../models/Merchant.js");

// Register new merchant
router.post("/register", async (req, res) => {
  const {
    userId,
    storeName,
    fullName,
    addressLine1,
    addressLine2,
    city,
    state,
    zipCode,
    country,
    website,
    businessType,
    phoneNumber,
    description,
    agreedToTerms,
  } = req.body;

  const newMerchant = new Merchant({
    userId,
    website,
    businessType,
    storeName,
    fullName,
    addressLine1,
    addressLine2,
    city,
    state,
    zipCode,
    country,
    phoneNumber,
    description,
    agreedToTerms,
  });

  try {
    await newMerchant.save();
    res.status(201).json({ message: "Merchant registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to register merchant" });
  }
});

module.exports = router;
