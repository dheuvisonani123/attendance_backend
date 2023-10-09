const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chats = new Schema({
  addnote: { type: String },
  
  
});

module.exports = mongoose.model("Chats", chats);