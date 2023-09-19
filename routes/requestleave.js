const express = require("express");
const router = express.Router();
const RequestLeave = require("../models/requestleave");

// Create a new leave request
router.post("/requestleave", async (req, res) => {
  try {
    // Extract the leave request data from the request body
    const { fromedate, todate, casualleave, reasonofleave } = req.body;

    // Create a new leave request using the RequestLeave model
    const newLeaveRequest = new RequestLeave({
      fromedate,
      todate,
      reasonofleave,
    });

    // Save the new leave request to the database
    await newLeaveRequest.save();

    res.status(201).json({
      statusCode: 201,
      message: "Leave request created successfully",
      leaveRequest: newLeaveRequest,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
});

module.exports = router;
