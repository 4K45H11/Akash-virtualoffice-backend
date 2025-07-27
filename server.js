const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require('cors')

const authRoutes = require("./routes/auth.route");
const founderRoutes = require("./routes/founder.route");
const userRoutes = require("./routes/user.route")

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors())
app.get('/',(req,res)=>{
    res.status(200).json({msg:'welcome to Virtual Office server'})
})

//api routes
app.use("/api/auth", authRoutes);
app.use("/api/founder", founderRoutes);
app.use("/api/user",userRoutes)
//server connection and start.
mongoose.connect(process.env.MONGO_URI, {
}).then(() => {
  console.log("connected to the database");
  app.listen(5000, () => console.log("server running on port 5000"));
}).catch((err) => {
  console.error("DB connection error:", err.message);
});
