const express = require("express");
const router = express.Router();
const Merchant = require("../models/Merchant.js");

// Register new merchant
router.post("/register", async (req, res) => {
  const {
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
  } = req.body;

  const newMerchant = new Merchant({
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

// Update merchant details
router.put("/update/:id", async (req, res) => {
  const merchantId = req.params.id;
  const updateData = req.body;
  try {
    const updatedMerchant = await Merchant.findByIdAndUpdate(
      merchantId,
      updateData,
      { new: true }
    );
    if (updatedMerchant) {
      res.status(200).json({
        message: "Merchant details updated successfully",
        updatedMerchant,
      });
    } else {
      res.status(404).json({ error: "Merchant not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update merchant details" });
  }
});

// Delete merchant detail

router.delete("/delete/:id", async (req, res) => {
  const merchantId = req.params.id;
  try {
    const deletedMerchant = await Merchant.findByIdAndDelete(merchantId);
    if (deletedMerchant) {
      res.status(200).json({ message: "Merchant deleted successfully" });
    } else {
      res.status(404).json({ error: "Merchant not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete merchant" });
  }
  res.status(500).json({ error: "Failed to delete merchant" });
});

module.exports = router;
