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

router.get('/comparePunchTimes', async (req, res) => {
  try {
    
    // Retrieve documents with punch-in status
    const punchingDocs = await punching.find({ status: 'Punch In' });
    console.log('Punching Documents:', punchingDocs);

    // Specify the fixed punch-in time limit
    const fixedPunchInTimeLimit = '10:00:00';

    // Filter employees who punched in later than the fixed limit based on punch-in time
    const lateEmployees = punchingDocs.filter((doc) => {
      const punchInTime = doc.attendandanceTime;
      return punchInTime < fixedPunchInTimeLimit;
    });
    console.log('Late Employees:', lateEmployees);
    const totalLateEmployees = lateEmployees.length;
    
    res.json({ lateEmployees, totalLateEmployees });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});









    

  
module.exports = router;