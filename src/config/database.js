const mongoose = require("mongoose");

const URI =
    "mongodb+srv://saddamwork:saddam@cluster0.4wzeg.mongodb.net/devTinder?retryWrites=true&w=majority&appName=Cluster0";  //mongoDB Atlas

//   "mongodb://127.0.0.1:27017/devTinder?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.4.0";    //mongosh local

const connectDB = async () => {
  await mongoose.connect(URI);
};

module.exports = connectDB;

/**  (Another Way)
const connectDB = async () => {
  try {
    await mongoose.connect(URI)
    console.log("Database connect")
  } catch (error) {
    console.error("Database connection failed");
  }
}
*/
