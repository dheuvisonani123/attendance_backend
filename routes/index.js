var express = require("express");
var router = express.Router();
var Register = require("../models/employee");

const employee = require("../models/employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
var { createToken } = require("../authentication");

// var reg=require("../models/router");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ title: "Express" });
});

router.post("/company", async (req, res) => {
  try {
    const user = await Register.findOne({
      name: req.body.name,
    });
    if (user) {
      return res
        .status(400)
        .send({ statusCode: 403, message: "name already in use" });
    }

    var count = await employee.count();
    function pad(num) {
      num = num.toString();
      while (num.length < 2) num = "0" + num;
      return num;
    }

    const employeeName = req.body.name;
    const paddedCount = pad(count + 1);
    // Assuming name is in req.body

    // Generate the employee ID by combining the padded count and the name
    const empid = employeeName + paddedCount;

    // Assign the generated employee ID to req.body
    req.body["empid"] = empid;

    const data = await Register.create(req.body);

    if (data) {
      res.json({
        statusCode: 200,
        data: data,
        message: "Register Successfully",
      });
    }
  } catch (error) {
    res.json({
      statusCode: 500,
      message: error.message,
    });
  }
});

module.exports = router;

router.get("/search/:mobileNumber", async (req, res) => {
  try {
    const mobileNumber = req.params.mobileNumber;

    // Use Mongoose to find records by mobile number
    const results = await employee.find({ mobileNo: mobileNumber });

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

module.export = router;

router.put("/imageupdate/:id",async (req, res) => {
  try {
    let result = await employee.findByIdAndUpdate(req.params.id, req.body);
    res.json({
      statusCode: 200,
      data: result,
      message: "profile photo updated",
    });
  } catch (err) {
    res.json({
      statusCode: 500,
      message: err.message,
    });
  }
});

router.delete("/company/:id", async (req, res) => {
  try {
    const deletedCompany = await Register.findByIdAndRemove(req.params.id);

    if (!deletedCompany) {
      return res.status(404).json({
        statusCode: 404,
        message: "Company not found",
      });
    }

    res.json({
      statusCode: 200,
      data: deletedCompany,
      message: "Company deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});
//autoid generate

// Assuming this code is inside an asynchronous function or an async route handler.

//login page


router.post("/login", async (req, res) => {
  try {
    // Find a user with the provided name
    const user = await Register.findOne({ name: req.body.name, password: req.body.password });

    if (!user) {
      return res
        .status(403)
        .json({ statusCode: 403, message: "Invalid name and password" });
    }

    // Check if the provided password matches the stored password using bcrypt

    // Create a token using the user's information (excluding the password)
    const token = await createToken({
      _id: user._id,
      name: user.name,
      email: user.email,
      password:user.password,
      mobileNo: user.mobileNo,
      address: user.address
    });

    // Send the token as a response
    res.status(200).json({
      statusCode: 200,
      message: "User Authenticated",
      token: token,
      mobileNo: user.mobileNo
    });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message });
  }
});

module.exports = router;
