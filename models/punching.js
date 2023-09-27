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

  punchindate: {type: String},
  punchoutdate: {type: String},
  attendandanceTime: {type: String},
  status: {type: String},
  mobileNo:{type: String},
  
  
});

module.exports = mongoose.model("Punching", punching);