const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const punching = new Schema({
  punchingdate: { type: String },
  punchingtime:{ type: String },
  mobileNo:{type: String},
  profile:{type:String}
  
  
});

module.exports = mongoose.model("Punching", punching);