const express = require("express");
const router = express.Router();
const leave = require("../models/leave");

// Create a new leave request
router.post("/requestleave", async (req, res) => {
  try {
    // Extract the leave request data from the request body
    const { fromdate, todate, leavetype, reasonofleave , empid} = req.body;

    // Create a new leave request using the RequestLeave model
    const newLeaveRequest = new leave({
      fromdate,
      todate,
      leavetype,
      reasonofleave,
      empid,
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



router.get("/getleave", async (req, res) => {
    try {
      // Fetch all leave requests from the database
      const leaveRequests = await leave.find();
  
      res.status(200).json({
        statusCode: 200,
        message: "Leave requests fetched successfully",
        leaveRequests: leaveRequests,
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

 router.put('/leaverequest/:empid', async (req, res) => {
  
    try {
      const empid = req.params.empid;
      const request = await leave.findOneAndUpdate(
        { empid },
        req.body,
        
      );
  
      if (!request) {
        return res.status(404).json({ message: 'Leave request not found' });
      }  
      res.json({
        statusCode: 200,
        data: request,
        message: "request approved"
      })
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
module.exports = router;