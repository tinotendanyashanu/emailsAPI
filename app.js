const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const bodyParser = require("body-parser");
require("dotenv").config();

const uri = process.env.ATLAS_URI;
const app = express();

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

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
