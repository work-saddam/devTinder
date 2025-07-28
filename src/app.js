const express = require("express");
const app = express();
const connectDB = require("./config/database");

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