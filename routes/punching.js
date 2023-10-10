const express = require("express");
const router = express.Router();
const Punching = require("../models/punching");
const punching = require("../models/punching");

// router.post("/punching", async (req, res) => {
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

router.get("/search/:mobileNumber", async (req, res) => {
  try {
    const mobileNumber = req.params.mobileNumber;

    // Use Mongoose to find records by mobile number
    const results = await Punching.find({ mobileNo: mobileNumber });

    res.status(200).json({
      statusCode: 200,
      message: "Search results",
      data: results,
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

// router.get("/calculateTime/:mobileNo", async (req, res) => {
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






// router.get("/attandance/:mobileNumber/:attendandanceDate", async (req, res) => {
//   try {
//     const mobileNumber = req.params.mobileNumber;
//     const attendandanceDate = req.params.attendandanceDate;
//     console.log('>>', attendandanceDate)

//     // Use Mongoose to find records by mobile number
//     const punchIn = await punching.findOne({
//       mobileNo: mobileNumber,
//       attendandanceDate: attendandanceDate,
//       status: "Punch in",
//     });
//     console.log("punchIn",punchIn)
// console.log("punchIn",punchIn)
//     const punchOut = await punching.findOne({
//       mobileNo: mobileNumber,
//       attendandanceDate: attendandanceDate,
//       status: "Punch out",
//     });
// console.log("punchOut",punchOut)
//     if (punchIn && punchOut) {
//       // Extract hours, minutes, and seconds from the time strings
//       const punchInTimeParts = punchIn.attendandanceTime.split(":");
//       const punchOutTimeParts = punchOut.attendandanceTime.split(":");
      
//       const punchInHours = parseInt(punchInTimeParts[0]);
//       const punchInMinutes = parseInt(punchInTimeParts[1]);
//       const punchInSeconds = parseInt(punchInTimeParts[2]);
      
//       const punchOutHours = parseInt(punchOutTimeParts[0]);
//       const punchOutMinutes = parseInt(punchOutTimeParts[1]);
//       const punchOutSeconds = parseInt(punchOutTimeParts[2]);

//       // Calculate hours, minutes, and seconds
//       const hours = punchOutHours - punchInHours;
//       const minutes = punchOutMinutes - punchInMinutes;
//       const seconds = punchOutSeconds - punchInSeconds;

//       // Ensure minutes and seconds are positive
//       if (seconds < 0) {
//         minutes -= 1;
//         seconds += 60;
//       }

//       if (minutes < 0) {
//         hours -= 1;
//         minutes += 60;
//       }

//       const totalTime = `${hours}:${minutes}:${seconds}`;
//       console.log("totalTime",totalTime)
//       res.status(200).json({
//         statusCode: 200,
//         message: "Search results",
//         data: {
//           punchIn: punchIn,
//           punchOut: punchOut,
//           totalTime: totalTime,
//         },
//       });
//     } else {
//       res.status(404).json({
//         statusCode: 404,
//         message: "Punch In or Punch Out record not found for the given date and mobile number",
//       });
//     }
//   } catch (error) {
//     // Handle any errors that occur during the process
//     res.status(500).json({
//       statusCode: 500,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// });





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

    
    let totalHours = 0;
    let totalMinutes = 0;
    let totalSeconds = 0;
    
    const getTimeDiffrence = (fromtime,totime) => {
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

      console.log('getTimeDiff', `${hours}:${minutes}:${seconds}`)
      return { hours, minutes, seconds };
    }
// it's work properly
    for(var i = 0 ; i < records.length ; i+=2) {
      const recordDate = records[i].attendandanceDate;
      const recordTime = records[i].attendandanceTime;
      const status = records[i].status;
      console.log(status === 'Punch in' , records[i+1].status === 'Punch out' , records[i+1].attendandanceDate.toString().slice(0,10) === recordDate.toString().slice(0,10), records[i+1].attendandanceDate, recordDate )
      if(status === 'Punch in' && records[i+1].status === 'Punch out' && records[i+1].attendandanceDate.toString().slice(0,10) === recordDate.toString().slice(0,10) ){
        const timeDiffrence = getTimeDiffrence(recordTime, records[i+1].attendandanceTime);
        totalHours += timeDiffrence.hours;
        totalMinutes += timeDiffrence.minutes;
        totalSeconds += timeDiffrence.seconds;
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

    

    console.log('totalHour', totalHours)
    console.log('totalMinutes', totalMinutes)
    console.log('totalSeconds', totalSeconds)


    res.status(200).json({
      statusCode: 200,
      message: "Daily Time Differences",
      data: {
        dailyTimeDifferences,
        total: `${totalHours} hours and ${totalMinutes} minutes`,
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







module.exports = router;
