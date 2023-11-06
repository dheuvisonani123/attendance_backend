const express = require("express");
const router = express.Router();
const Latecount = require("../models/latecount");
const punching = require("../models/punching");

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
  

  router.get('/latecounts/:date', async (req, res) => {
    try {
        const selectedDate = new Date(req.params.date);
      
        // Count of "latecount" records where status is "Punch In" and attendandanceTime is not equal to 9:00 AM
        const lateCount = await punching.countDocuments({
            status: "Punch In",
            attendandanceTime: { $ne: '09:00:00' },
            attendandanceDate: selectedDate // Use the parsed date from the parameter
        });

        // Calculate the range format
        const late = `${lateCount}`;

        res.status(200).json({
            statusCode: 200,
            message: 'Count of matching records',
            late,
            selectedDate: selectedDate
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
});

  
  
  
  
module.exports = router;