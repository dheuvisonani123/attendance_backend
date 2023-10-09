const express = require("express");
const router = express.Router();
const Chats = require("../models/chats");

// Create a new chat message
router.post("/chats", async (req, res) => {
  try {
    // Extract the chat message text from the request body
    const { chat } = req.body;

    // Create a new chat message using the Chats model
    const newChatMessage = new Chats({
      chat,
    });

    // Save the new chat message to the database
    await newChatMessage.save();

    res.status(201).json({
      statusCode: 201,
      message: "Chat message created successfully",
      chatMessage: newChatMessage,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
});

module.exports = router;
