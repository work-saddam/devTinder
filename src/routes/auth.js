const express = require("express")
const authRouter = express.Router()
const bcrypt = require("bcrypt")
const User = require("../models/user")
const {validateSignUpData} = require("../utils/validation")

//Signup
authRouter.post("/signup", async (req, res) => {
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

// Login
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      throw new Error("email and password are required");
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    // compare the password in userSchema
    const isPasswordValid = await user.validatePassword(password)

    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
    }

    // Create jwt token in user schema
    const token = await user.getJWT();

    // Add token in cookie and send response back to the user
    res.cookie("token", token);

    res.status(200).send("Login successfully");
  } catch (error) {
    res.status(400).send("Error:  " + error.message);
  }
});

module.exports = authRouter