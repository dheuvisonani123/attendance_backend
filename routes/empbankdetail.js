const express = require("express");
const router = express.Router();
const Empbankdetail = require("../models/empbankdetail");

router.post("/bank", async (req, res) => {
  try {
    // Check if a user with the provided account number already exists
    const user = await Empbankdetail.findOne({
      accountNumber: req.body.accountNumber,
    });

    if (user) {
      //if user exist
      return res.status(403).json({
        statusCode: 403,
        message: "Account number already in use",
      });
    } else {
     
      // Create a new user based on the request body
      const newUser = new Empbankdetail({
        accountNumber: req.body.accountNumber,
        bankName:req.body.bankName,
        ifsccode:req.body.ifsccode,
        holdername:req.body.holdername,

        // Add other user details here
      });
      await newUser.save();
      
      // Save the new user to the database
     

      res.status(200).json({
        statusCode: 200,
        message: "Successfully created user",
      });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

module.exports = router;
