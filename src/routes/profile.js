const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

// get Profile
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.send("ERROR: " + error.message);
  }
});

module.exports = profileRouter;
