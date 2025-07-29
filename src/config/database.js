const mongoose = require("mongoose");

    
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
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
