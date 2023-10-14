const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const uri = process.env.ATLAS_URI;
const app = express();

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(cors());
app.use(bodyParser.json());

// Define Email Schema and Model
const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
});

const Email = mongoose.model("Email", emailSchema);

// Subscribe route
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  try {
    const newEmail = new Email({ email });
    await newEmail.save();
    res.status(201).json({ message: "Subscribed successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error subscribing." });
  }
});

module.exports = app;
