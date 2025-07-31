const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

// Get Profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.send("ERROR: " + error.message);
  }
});

// Edit Profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateEditProfileData(req);

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

// Change password
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      throw new Error("all fields are required");

    const isPasswordValid = await loggedInUser.validatePassword(currentPassword);
    if (!isPasswordValid) throw new Error("Incorrect Password");

    const isStrongPassword = validator.isStrongPassword(newPassword)
    if(!isStrongPassword) throw new Error("Please enter strong password")

    const passwordHash = await bcrypt.hash(newPassword, 10);

    loggedInUser.password = passwordHash;
    await loggedInUser.save();

    res.send("Password updated successfully");
  } catch (error) {
    res.send("ERROR: " + error.message);
  }
});



module.exports = profileRouter;
