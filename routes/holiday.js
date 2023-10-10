
// Define the POST route to create a new holiday
const express = require("express");
const router = express.Router();
const Holiday = require("../models/holiday");

router.post("/holidays", async (req, res) => {
  try {
    // Create a new holiday record using the data from the request body
    const newHoliday = new Holiday({
      holidaytype: req.body.holidaytype,
      date: req.body.date,
    });

    // Save the new holiday record to the database
    await newHoliday.save();

    // Respond with a success message and the created holiday object
    res.status(201).json(newHoliday);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the holiday record." });
  }
});

router.get("/holidays", async (req, res) => {
  try {
    // Query the database to retrieve all holiday records
    const holidays = await Holiday.find();

    // Respond with the list of holiday records
    res.status(200).json(holidays);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching holiday records." });
  }
});
module.exports = router;
