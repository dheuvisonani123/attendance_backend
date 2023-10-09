const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestleave = new Schema({
  fromdate: { type: String },
  todate:{type:String},
  leavetype:{type:String},
  reasonofleave:{type:String},

  
  
});

module.exports = mongoose.model("requestleave", requestleave);