const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require('cors')

const authRoutes = require("./routes/auth.routes");
const founderRoutes = require("./routes/founder.routes");

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

//server connection and start.
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("connected to the database");
  app.listen(5000, () => console.log("server running on port 5000"));
}).catch((err) => {
  console.error("DB connection error:", err.message);
});
