const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chat = new Schema({
  chat: { type: String },
  
  
});

module.exports = mongoose.model("chat", chat);