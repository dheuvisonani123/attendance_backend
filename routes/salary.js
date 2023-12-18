const express = require("express");
const router = express.Router();
const salary=require("../models/salary");




router.post("/salary", async (req, res) => {
    try {
      
      var data = await salary.create(req.body);
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



  router.get("/salary",async (req, res) => {
    try{
      var data=await salary.find();

      res.json({
        statusCode:200,
        data:data,
        message:"retrive succesfully",
      });
    }
    catch(error){
      res.json({
        statusCode:500,
        message:error.message,
      });
    }   
  });

module.exports = router;