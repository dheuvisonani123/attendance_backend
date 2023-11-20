const express = require("express");
const router = express.Router();
const Punching = require("../models/punching");
const punching = require("../models/punching");
const Employee = require('../models/employee');







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
router.get("/attendance/:mobileNumber/:fromDate/:toDate", async (req, res) => {
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

    // Helper function to calculate time difference
    const getTimeDifference = (fromtime, totime) => {
      const punchInTimeParts = fromtime.split(":");
      const punchOutTimeParts = totime.split(":");

      let punchInHours = parseInt(punchInTimeParts[0]);
      let punchInMinutes = parseInt(punchInTimeParts[1]);
      let punchInSeconds = parseInt(punchInTimeParts[2]);

      const punchOutHours = parseInt(punchOutTimeParts[0]);
      const punchOutMinutes = parseInt(punchOutTimeParts[1]);
      const punchOutSeconds = parseInt(punchOutTimeParts[2]);

      // Calculate hours, minutes, and seconds
      let hours = punchOutHours - punchInHours;
      let minutes = punchOutMinutes - punchInMinutes;
      let seconds = punchOutSeconds - punchInSeconds;

      // Ensure minutes and seconds are positive
      if (seconds < 0) {
        minutes -= 1;
        seconds += 60;
      }

      if (minutes < 0) {
        hours -= 1;
        minutes += 60;
      }

      return { hours, minutes, seconds };
    };

    // Calculate total time differences
    let totalHours = 0;
    let totalMinutes = 0;
    let totalSeconds = 0;
    const dailyTimeDifferences = [];

    for (let i = 0; i < records.length; i += 2) {
      const recordDate = records[i].attendandanceDate;
      const recordTime = records[i].attendandanceTime;
      const status = records[i].status;

      if (status === "Punch in" && records[i + 1]?.status === "Punch out" &&
        records[i + 1].attendandanceDate.toString().slice(0, 10) === recordDate.toString().slice(0, 10)
      ) {
        const timeDifference = getTimeDifference(recordTime, records[i + 1].attendandanceTime);
        totalHours += timeDifference.hours;
        totalMinutes += timeDifference.minutes;
        totalSeconds += timeDifference.seconds;

        dailyTimeDifferences.push({
          date: recordDate,
          difference: `${timeDifference.hours} hours and ${timeDifference.minutes} minutes`,
        });
      }
    }

    // Convert excess minutes and seconds to hours
    if (totalSeconds >= 60) {
      totalMinutes += Math.floor(totalSeconds / 60);
      totalSeconds %= 60;
    }
    if (totalMinutes >= 60) {
      totalHours += Math.floor(totalMinutes / 60);
      totalMinutes %= 60;
    }

    const formattedTotalTimeDifference = `${totalHours} hours and ${totalMinutes} minutes`;

    // Calculate the number of days in the date range
    const millisecondsInADay = 1000 * 60 * 60 * 24; // Number of milliseconds in a day
    const timeDifferenceInMilliseconds = toDate - fromDate;
    const numberOfDays = Math.floor(timeDifferenceInMilliseconds / millisecondsInADay) + 1;

    // Send the response
    res.status(200).json({
      statusCode: 200,
      message: "Daily Time Differences",
      data: {
        dailyTimeDifferences,
        total: formattedTotalTimeDifference,
        numberOfDays,
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

    // Find mobile numbers and names in the 'employee' collection
    const employees = await Employee.find({}, 'mobileNo name');

    // Find mobile numbers in the 'punching' collection for the selected date
    const punchMobiles = await Punching.distinct('mobileNo', {
      attendandanceDate: selectedDate,
    });

    // Find mobile numbers that are present in both collections
    const matchingEmployees = employees.filter((employee) => punchMobiles.includes(employee.mobileNo));
    const mismatchedEmployees = employees.filter((employee) => !punchMobiles.includes(employee.mobileNo));

    const presentData = matchingEmployees.map((employee) => ({
      name: employee.name,
      mobileNo: employee.mobileNo,
    }));

    const absentData = mismatchedEmployees.map((employee) => ({
      name: employee.name,
      mobileNo: employee.mobileNo,
    }));

    // Extract punch in and punch out times for present employees
    const punchData = await Punching.find({
      attendandanceDate: selectedDate,
      mobileNo: { $in: matchingEmployees.map((employee) => employee.mobileNo) },
    });

    const presentWithAttendance = matchingEmployees.map((employee) => {
      const employeePunchData = punchData.find((punch) => punch.mobileNo === employee.mobileNo);
      if (employeePunchData) {
        return {
          name: employee.name,
          mobileNo: employee.mobileNo,
          punchIn: employeePunchData.attendandanceTime,
          punchOut: punchData.find((punch) => punch.mobileNo === employee.mobileNo && punch.status === 'Punch Out')
            ?.attendandanceTime,
        };
      }
      return null;
    });

    const presentWithPunchTimes = presentWithAttendance.filter((employee) => employee !== null);

    const present = presentWithPunchTimes.length;
    const absent = absentData.length;

    res.status(200).json({
      statusCode: 200,
      message: `Mobile numbers, names, and attendance times present in both "employee" and "punching" collections for the date ${selectedDate.toISOString()}`,
      data: {
        present: {
          count: present,
          employees: presentWithPunchTimes,
        },
        absent: {
          count: absent,
          employees: absentData,
        },
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


router.get('/employee-punch-records/:mobileNo/:year/:month', async (req, res) => {
  try {
    const { mobileNo, year, month } = req.params;

    const firstDayOfMonth = new Date(year, month - 1, 1);
    const currentDate = new Date();
    const lastDayOfMonth = new Date(year, month - 1, currentDate.getDate(), 23, 59, 59);

    const presentDays = await Punching.distinct('attendandanceDate', {
      mobileNo,
      attendandanceDate: { $gte: firstDayOfMonth, $lte: currentDate }, // Updated condition
      status: 'Punch In',
    });


    const totalDaysInMonth = currentDate.getDate(); // Use the current date
    const absentDays = totalDaysInMonth - presentDays.length;

    res.status(200).json({
      statusCode: 200,
      message: `Punch in records for ${mobileNo} in ${year}-${month}`,
      data: {
        presentDays: presentDays.length,
        absentDays: absentDays,
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




