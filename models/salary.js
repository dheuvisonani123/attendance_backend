const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const salarySchema = new Schema({
  
  empid:{type: String},
  salary:{type:Number},
     
});

module.exports = mongoose.model("salary", salarySchema);