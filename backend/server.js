const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config()

const authRoutes = require('./routes/auth.router');
const hrRoutes = require('./routes/hr.router')
const taskRoutes = require('./routes/task.route')

const app = express();
app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
  res.status(200).json({message:'Welcome to the virtual office server'})
})

app.use('/api/auth', authRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/tasks', taskRoutes);

mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log('MongoDB Connected');
  app.listen(5000, () => console.log('Server running on port 5000'));
})
.catch(err => console.log(err));
