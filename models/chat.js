const mongoose = require("mongoose");
// var router = express.Router();
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  // User
 addchat : { type: String },
});

module.exports = mongoose.model("chat", ChatSchema);