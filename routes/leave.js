const express = require("express");
const router = express.Router();
const leave = require("../models/leave");


// Create a new leave request
router.post("/requestleave", async (req, res) => {
  try {
    // Extract the leave request data from the request body
    const { fromdate, todate, leavetype, reasonofleave, empid } = req.body;

    // Create a new leave request using the Leave model
    const newLeaveRequest = new leave({
      fromdate,
      todate,
      leavetype,
      reasonofleave,
      empid,
      // The "status" field will be set to the default value "pending"
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


  router.get("/getleave/:empid", async (req, res) => {
    try {
      // Get the empid parameter from the request query
      const empid = req.params.empid;

      if (!empid) {
        return res.status(400).json({
          statusCode: 400,
          message: "Employee ID (empid) is required in the query parameters."
        });
      }

      // Fetch leave requests for the specified employee from the database
      const leaveRequests = await leave.find({ empid });

      // Calculate the count of approved and rejected leave requests for the employee
      const approvedCount = leaveRequests.filter(request => request.status === 'approved').length;
      const rejectedCount = leaveRequests.filter(request => request.status === 'rejected').length;

      res.status(200).json({
        statusCode: 200,
        message: "Leave requests fetched successfully",
        leaveRequests: leaveRequests,
        approvedCount: approvedCount,
        rejectedCount: rejectedCount,
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