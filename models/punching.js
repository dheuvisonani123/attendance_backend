const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const punching = new Schema({
  // punchingdate: { type: String },
  // punchingtime:{ type: String },
  // punchoutdate:{type:String},
  // punchOuttime:{type:String},
  // mobileNo:{type: String},
  // profile:{type:String},
  // status:{type:String}

 
  attendandanceTime: {type: String},
  attendandanceDate:{type:Date},
  status: {type: String},
  mobileNo:{type: String},
  fromDate:{type: String},
  toDate:{type: String},
  // date: { type: Date, default: Date.now },
  date: { type: Date},
  name:{}
  

  
  
  
  
  
});

module.exports = mongoose.model("Punching", punching);