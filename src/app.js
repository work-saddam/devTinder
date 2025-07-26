const express = require("express");
const app = express();

app.get('/users', (req,res, next) => {
  console.log("Handle 1")
  // res.send("Handle1")
  next()
},(req,res,next) => {
  console.log("Handle 2")
  // res.send("Heading2")
  next()
},
(req,res) => {
  console.log("Handle 3")
  res.send("Heading3")
})

app.listen(7777, () => {
  console.log(`Server is listening on http://localhost:7777`);
});
