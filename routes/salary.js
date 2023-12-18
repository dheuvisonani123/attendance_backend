const express = require("express");
const router = express.Router();
const salary = require("../models/salary"); // Adjust the path based on your project structure

router.post("/salary", async (req, res) => {
    try {
        console.log("hitt...");
        var data = await salary.create(req.body);
        console.log("data kdslda", data);
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

module.exports = router;
