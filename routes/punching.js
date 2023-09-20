const express = require("express");
const router = express.Router();
const Punching = require("../models/punching");

router.post("/punching", async (req, res) => {
  try {
    const { punchingdate, punchingtime, mobileNo } = req.body;

    // Create a new leave request using the Punching model
    const newPunching = new Punching({
      punchingdate: punchingdate,
      punchingtime: punchingtime,
      mobileNo: mobileNo,
    });

    // Save the new punching record to the database
    await newPunching.save();

    res.status(201).json({
      statusCode: 201,
      message: "Successfully created punching record",
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

router.get("/timecount/:mobileNo", (req, res) => {
  const mobileNo = req.params.mobileNo;
  console.log(mobileNo,)
  if (!userTimes[mobileNo] || !userTimes[mobileNo].punchInTime) {
    return res.status(400).json({ message: "Punch-in time not recorded." });
  }

  const punchInTime = userTimes[mobileNo].punchInTime;
  const punchOutTime = userTimes[mobileNo].punchOutTime;

  if (!punchOutTime) {
    return res.status(400).json({ message: "Punch-out time not recorded." });
  }

  const elapsedTime = punchOutTime - punchInTime;

  res.status(200).json({ elapsedTime: elapsedTime });
});

module.exports = router;
