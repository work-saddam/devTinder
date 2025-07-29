const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./config/database");
const User = require("./models/user");

//Convert JSON in js Object
//Middleware parses incoming requests with JSON payloads and makes the data available on req.body.
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send("user created successfully");
  } catch (error) {
    res.status(400).send("something went wrog");
  }
});

// Feed API - Get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body.userId);
    res.send("user deleted Successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user", async (req,res) => {
  try{
    const userId = req.body.userId;
    const data = req.body;
    const user = await User.findByIdAndUpdate(userId, data, {returnDocument:'after'})
    res.send({message:"User updated: ", user})
  }catch(err){
    res.status(400).send("Something went wrong")
  }
})

//connect database & listening server
connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(7777, () => {
      console.log("Server is listening on http://localhost:7777");
    });
  })
  .catch((err) => {
    console.error("Database connection failed");
  });
