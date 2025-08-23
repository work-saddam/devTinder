const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");

//Signup
authRouter.post("/signup", async (req, res) => {
  try {
    // Validate the req data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    const existingUser = await User.findOne({ emailId: emailId });
    if (existingUser) {
      throw new Error("Email already exist!");
    }

    // Hashing the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Creating the instanse of user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();

    // Create jwt token in user schema
    const token = await user.getJWT();

    // Add token in cookie and send response back to the user
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 8 * 60 * 60 * 1000,
    });

    res
      .status(201)
      .json({ message: "User created successfully", data: savedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      throw new Error("Email and Password are required!");
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials!");
    }

    // compare the password in userSchema
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new Error("Invalid Credentials!");
    }

    // Create jwt token in user schema
    const token = await user.getJWT();

    // Add token in cookie and send response back to the user
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 8 * 60 * 60 * 1000,
    });

    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Logout
authRouter.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({ message: "Logout Successfully!!" });
});

module.exports = authRouter;
