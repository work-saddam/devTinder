const express = require("express");
const app = express();

app.use("/test", (req, res) => {
  res.send("Test");
});
app.use("/hello", (req, res) => {
  res.send("hello");
});

app.listen(7777, () => {
  console.log(`Server is listening on http://localhost:7777`);
});
