const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: 'routes/.env' });

// Connect to DB
connectDB();

// Initialize app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
// app.get("/", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "Welcome to my own app 🚀",
//   });
// });


app.use("/api/v1/auth", require("./routes/userRoutes"))

app.use("/api/v1/post", require("./routes/postRoutes"))

//home
app.get("/", (req, res) => {
  res.status(200).send({
    success:true,
    "msg": "node server running"
  })
})

// PORT
const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`.bgGreen.white);
});
