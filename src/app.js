const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

//Convert JSON in js Object
//Middleware parses incoming requests with JSON payloads and makes the data available on req.body.
app.use(express.json());

//Signup
app.post("/signup", async (req, res) => {
  try {
    // Validate the req data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Hashing the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Creating the instanse of user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

//Login
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
    }

    res.status(200).send("Login successfully");
  } catch (error) {
    res.status(400).send("Error:  " + error.message);
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

app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params?.userId;
    const data = req.body;

    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send({ message: "User updated: ", user });
  } catch (err) {
    res.status(400).send("UPDATE FAILED: " + err.message);
  }
});

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
