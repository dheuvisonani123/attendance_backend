const express = require("express");
const router = express.Router();
const Punching = require("../models/punching");
const punching = require("../models/punching");
const Employee = require('../models/employee');



//   try {
//     const { punchingdate, punchingtime, mobileNo,punchouttime,punchoutdate} = req.body;

//     // Create a new leave request using the Punching model
//     const newPunching = new Punching({
//       punchingdate: punchingdate,
//       punchingtime: punchingtime,
//       mobileNo: mobileNo,
//       punchoutdate:punchoutdate,
//       punchOuttime:punchouttime,
//     });

//     // Save the new punching record to the database
//     await newPunching.save();

//     res.status(201).json({
//       statusCode: 201,
//       message: "Successfully created punching record",
//     });
//   } catch (error) {
//     // Handle any errors that occur during the process
//     res.status(500).json({
//       statusCode: 500,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// });

// router.post("/punching", async (req, res) => {
//   try {
//     const { punchingdate,status, punchingtime, mobileNo,punchoutdate ,punchOuttime} = req.body;

//     // Create a new leave request using the Punching model
//     const newPunching = new Punching({
//       punchingdate: punchingdate,
//       punchingtime: punchingtime,
//       mobileNo: mobileNo,
//       punchoutdate:punchoutdate,
//       punchOuttime:punchOuttime,
//       status:status
//     });

//     // Save the new punching record to the database
//     await newPunching.save();

//     res.status(201).json({
//       statusCode: 201,
//       message: "Successfully created punching record",
//     });
//   } catch (error) {
//     // Handle any errors that occur during the process
//     res.status(500).json({
//       statusCode: 500,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// });

//get api




router.get("/punching/:mobileNo", async (req, res) => {
  try {
    const mobileNo = req.params.mobileNo;

    const results = await punching.find({ mobileNo: mobileNo });

    res.status(200).json({
      statusCode: 200,
      message: "Search results",
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
});

//   try {
//     const mobileNo = req.params.mobileNo;

//     // Find the punching record for the given mobileNo
//     const punchingRecord = await Punching.findOne({ mobileNo });
//     console.log("punchingRecord", punchingRecord);

//     if (!punchingRecord) {
//       return res.status(404).json({ status: "error", message: "Punching record not found." });
//     }

//     // Extract the punching and punchout times from the record
//     const { punchingdate, punchingtime, punchoutdate, punchOuttime,status } = punchingRecord;
//     console.log("punchingRecord", punchingRecord);

//     // Create Date objects from the timestamps
//     const punchingTime = new Date(`${punchingdate}T${punchingtime}`);
//     const punchOutTime = new Date(`${punchoutdate}T${punchOuttime}`);
//     console.log("punchOutTime", punchOutTime);

//     // Calculate the elapsed time in milliseconds
//     const elapsedTimeMilliseconds = punchOutTime - punchingTime;

//     // Calculate hours, minutes, and seconds from milliseconds
//     const hours = Math.floor(elapsedTimeMilliseconds / (1000 * 60 * 60));
//     const minutes = Math.floor((elapsedTimeMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((elapsedTimeMilliseconds % (1000 * 60)) / 1000);

//     res.status(200).json({
//       status: "success",
//       elapsedTime: {
//         hours,
//         minutes,
//         seconds,
//       },
//     });
//   } catch (error) {
//     // Handle any errors that occur during the process
//     res.status(500).json({
//       status: "error",
//       statusCode: 500,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// });

router.post("/attandance", async (req, res) => {
  try {
    
    var data = await punching.create(req.body);
    console.log("data kdslda",data)
    res.json({
      statusCode: 200,
      data: data,
      message: "Add  Successfully",
    });
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

//get api for




//get practice

router.get("/attandance/:mobileNumber/:fromDate/:toDate", async (req, res) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    const fromDate = new Date(req.params.fromDate);
    const toDate = new Date(req.params.toDate);

    // Find all "Punch in" and "Punch out" records for the mobile number and date range
    const records = await Punching.find({
      mobileNo: mobileNumber,
      attendandanceDate: {
        $gte: fromDate,
        $lte: toDate,
      },
    }).sort({ attendandanceDate: 1 }); // Sort records by date in ascending order
    console.log('records',records)

    // Calculate daily time differences
    const dailyTimeDifferences = [];
    let currentDay = null;
    let punchInTime = null;

    console.log(dailyTimeDifferences,"")
    
    let totalHours = 0;
    let totalMinutes = 0;
    let totalSeconds = 0;
    
      const getTimeDifference = (fromtime,totime) => {
      const punchInTimeParts = fromtime.split(":");
      const punchOutTimeParts = totime.split(":");
      
      const punchInHours = parseInt(punchInTimeParts[0]);
      const punchInMinutes = parseInt(punchInTimeParts[1]);
      const punchInSeconds = parseInt(punchInTimeParts[2]);
      
      const punchOutHours = parseInt(punchOutTimeParts[0]);
      const punchOutMinutes = parseInt(punchOutTimeParts[1]);
      const punchOutSeconds = parseInt(punchOutTimeParts[2]);

      // Calculate hours, minutes, and seconds
      const hours = punchOutHours - punchInHours;
      const minutes = punchOutMinutes - punchInMinutes;
      const seconds = punchOutSeconds - punchInSeconds;

      

      // Ensure minutes and seconds are positive
      if (seconds < 0) {
        minutes -= 1;
        seconds += 60;
      }

      if (minutes < 0) {
        hours -= 1;
        minutes += 60;
      }

      console.log('getTimeDifference', `${hours}:${minutes}:${seconds}`)
      return { hours, minutes, seconds, };
    }

    
// it's work properly
    for(var i = 0 ; i < records.length ; i+=2) {
      const recordDate = records[i].attendandanceDate;
      const recordTime = records[i].attendandanceTime;
      const status = records[i].status;
   
      if(status === 'Punch in' && records[i+1].status === 'Punch out' && records[i+1].attendandanceDate.toString().slice(0,10) === recordDate.toString().slice(0,10) ){
        const timeDifference = getTimeDifference(recordTime, records[i + 1].attendandanceTime);
        totalHours += timeDifference.hours;
        totalMinutes += timeDifference.minutes;
        totalSeconds += timeDifference.seconds;
        dailyTimeDifferences.push({
          date: recordDate,
          timeDifference: `${timeDifference.hours} hours and ${timeDifference.minutes} minutes`,
        });
      }
    }

    if(totalSeconds >= 60) {
      totalMinutes += Math.floor(totalSeconds / 60);
      totalSeconds = totalSeconds % 60;
    }
    if(totalMinutes >= 60) {
      totalHours += Math.floor(totalMinutes / 60);
      totalMinutes = totalMinutes % 60;
    }

    
    const formattedTotalTimeDifference = `${totalHours} hours and ${totalMinutes} minutes`;

    console.log('totalHour', totalHours)
    console.log('totalMinutes', totalMinutes)
    console.log('totalSeconds', totalSeconds)


    res.status(200).json({
      statusCode: 200,
      message: "Daily Time Differences",
      data: {
       dailyTimeDifferences: dailyTimeDifferences,
        total: formattedTotalTimeDifference,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Helper function to calculate time difference

router.get('/matching-mobiles/:date', async (req, res) => {
  try {
    const selectedDate = new Date(req.params.date);

    // Find mobile numbers in the 'employee' collection
    const employeeMobiles = await Employee.distinct('mobileNo');

    // Find mobile numbers in the 'punching' collection for the selected date
    const punchMobiles = await Punching.distinct('mobileNo', {
      attendandanceDate: selectedDate,
    });

    // Find mobile numbers that are present in both collections
    const matchingMobiles = employeeMobiles.filter((mobileNo) => punchMobiles.includes(mobileNo));

    const mismatchedMobiles = employeeMobiles.filter((mobileNo) => !punchMobiles.includes(mobileNo));
    const present = matchingMobiles.length;
    const absent=mismatchedMobiles.length;
    res.status(200).json({
      statusCode: 200,
      message: `Mobile numbers present in both "employee" and "punching" collections for the date ${selectedDate.toISOString()}`,
      data: {
        matchingMobiles: matchingMobiles,
        mismatchedMobiles:mismatchedMobiles,
        present: present,
        absent:absent,
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






router.get('/attendance/count', async (req, res) => {
  try {
    // Get the date from the query parameter (e.g., /attendance/count?date=2023-10-30)
    const dateParam = req.query.date;

    // Find records in the database for the specified date
    const records = await Punching.find({ "attendandanceDate": new Date(dateParam) });

    // Count "present" and "absent" entries
    let attendanceCounts = {
      present: 0,
      absent: 0,
    };

    records.forEach((record) => {
      if (record.presentabsent === 'present') {
        attendanceCounts.present++;
      } else if (record.presentabsent === 'absent') {
        attendanceCounts.absent++;
      }
    });

    res.json({
      statusCode: 200,
      data: attendanceCounts,
      message: 'Attendance counts retrieved successfully for the specified date.',
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});
router.get('/mismatched-mobiles/:date', async (req, res) => {
  try {
    const selectedDate = new Date(req.params.date);

    // Find mobile numbers in the 'employee' collection
    const employees = await Employee.find({}, 'mobileNo'); // Only retrieve the 'mobileNo' field

    // Find mobile numbers in the 'punching' collection for the selected date
    const punchMobiles = await Punching.distinct('mobileNo', {
      attendandanceDate: selectedDate,
      status: 'Punch in',
    });

    // Find mobile numbers that are in employees but not in punch records
    const mismatchedMobiles = employees
      .map((employee) => employee.mobileNo)
      .filter((mobileNo) => !punchMobiles.includes(mobileNo));


      const matchingMobiles = employees
     .map((employee) => employee.mobileNo)
      .filter((mobileNo) => punchMobiles.includes(mobileNo));

    res.status(200).json({
      statusCode: 200,
      message: 'Mobile numbers that do not match with Punch records for the specified date',
      data: {
        matchingMobiles: matchingMobiles,
        mismatchedMobiles: mismatchedMobiles,
        allEmployeeMobiles: employees.map((employee) => employee.mobileNo),
        
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




