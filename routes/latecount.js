const express = require("express");
const router = express.Router();
const Latecount = require("../models/latecount");
const punching = require("../models/punching");
const Employee = require('../models/employee');

// Create a new note
// Create a new note
router.post('/latecounts', async (req, res) => {
    try {
      const { punchintime, punchouttime ,mobileNo} = req.body;
  
      const latecount = new Latecount({
        punchintime,
        punchouttime,
        mobileNo,
      });
  
      await latecount.save();
  
      res.status(201).json({
        statusCode: 201,
        message: 'Latecount saved successfully',
        latecount,
      });
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
        error: error.message,
      });
    }
  });
  
  
  router.put('/latecounts/:mobileNo', async (req, res) => {
    const mobileNo = req.params.mobileNo;
  
    try {
      const { punchintime, punchouttime } = req.body;
  
      // Find the latecount document by mobileNo
      const latecount = await Latecount.findOne({ mobileNo });
  
      if (!latecount) {
        return res.status(404).json({
          statusCode: 404,
          message: 'Latecount not found',
        });
      }
  
      // Update the latecount properties
      latecount.punchintime = punchintime;
      latecount.punchouttime = punchouttime;
  
      // Save the updated latecount
      await latecount.save();
  
      res.status(200).json({
        statusCode: 200,
        message: 'Latecount updated successfully',
        latecount,
      });
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
        error: error.message,
      });
    }
  });
  


  
router.get('/latecoun/:date', async (req, res) => {
  try {
    const targetDate = new Date(req.params.date);

      // Get all "Punch In" and "Punch Out" records for the specified date
    const punchingRecords = await punching.find({
          $or: [
              { status: "Punch In", attendandanceDate: targetDate },
              { status: "Punch Out", attendandanceDate: targetDate },
          ],
      });

      // Get the "punchintime" values from the "latecount" collection
    const latecountPunchintimes = (await Latecount.find()).map((latecount) => latecount.punchintime);
console.log(latecountPunchintimes,"latecountPunchintimes")
      // Fetch employee names from the "Employee" collection
    const employeeNames = await Employee.find({
          mobileNo: { $in: punchingRecords.map((record) => record.mobileNo) },
      });

      // Create a mapping of mobile numbers to employee names
      const mobileToNameMap = {};
      employeeNames.forEach((employee) => {
          mobileToNameMap[employee.mobileNo] = employee.name;
      });

      // Combine the "Punch In" and "Punch Out" records with employee names
      const combinedRecords = punchingRecords.map((attendanceRecord) => {
          return {
              status: attendanceRecord.status,
              attendandanceTime: attendanceRecord.attendandanceTime,
              name: mobileToNameMap[attendanceRecord.mobileNo] || "N/A",
          };
      });

      const late = combinedRecords.filter((attendanceRecord) => {
          if (attendanceRecord.status === "Punch In") {
              return !latecountPunchintimes.includes(attendanceRecord.attendandanceTime);
          }
          return false;
      }).length;
console.log(late,"late")
      res.status(200).json({
          statusCode: 200,
          message: 'Punch In and Punch Out records retrieved successfully',
          attendanceRecords: combinedRecords,
          late: late,
          employeeNames:employeeNames,
      });
  } catch (error) {
      res.status(500).json({
          statusCode: 500,
          message: 'Internal server error',
          error: error.message,
      });
  }
});  

router.get('/compareLateCount', async (req, res) => {
  try {
    // Retrieve punch-in records from the punching collection
    const punchInRecords = await punching.find({ status: 'Punch In' });
    
    // Retrieve punch-in time limit from the latecount collection
    const lateCount = await Latecount.findOne({});
    const punchInTimeLimit = lateCount.punchintime;

    // Debug log to check the retrieved values
    console.log('Punch In Records:', punchInRecords);
    console.log('Punch In Time Limit:', punchInTimeLimit);

    // Filter late punch-in records
    const latePunchInRecords = punchInRecords.filter((record) => {
      const punchInTime = record.attendandanceTime;
      console.log('Comparing Punch In Time:', punchInTime, 'with Limit:', punchInTimeLimit);
      return punchInTime <= punchInTimeLimit;
    });

    console.log('Late Punch In Records:', latePunchInRecords);

    const totalLatePunchIns = latePunchInRecords.length;

    res.status(200).json({
      statusCode: 200,
      message: 'Comparison of late punch-ins based on latecount punchintime',
      data: {
        totalLatePunchIns,
        latePunchInRecords,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      error: error.message,
    });
  }
});











    

  
module.exports = router;