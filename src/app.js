const express = require("express");
const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.get("/users", userAuth, (req, res) => {
  res.send("user");
});

app.get("/admin/getData", (req, res) => {
  res.send("getting data");
});

app.get("/admin/deleteData", (req, res) => {
  res.send("deleting data");
});

app.listen(7777, () => {
  console.log(`Server is listening on http://localhost:7777`);
});
