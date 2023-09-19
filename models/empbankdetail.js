const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bankSchema = new Schema({
  bankName: { type: String },
  holdername: { type: String },
  ifsccode:{type:Number},
  accountNumber: { type: Number },
  
});

module.exports = mongoose.model("empbankdetail", bankSchema);