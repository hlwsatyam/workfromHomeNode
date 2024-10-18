// server.js

const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
// const router = require('./formRoutes');
require('dotenv').config();

// Initialize the Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse incoming request bodies as JSON

const db = async () => {
  try {
    // Connect to MongoDB
    await mongoose
      .connect('mongodb+srv://satyampandit021:20172522@rvbmhotelbooking.9hfzkrx.mongodb.net/wfh?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('Connected to MongoDB');
        // Start the server after the database connection
      })
      .catch((error) => {
        console.error('MongoDB connection failed:', error);
      });
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }
}
db()



// Use the form routes
// app.use('/api', router);
app.get('/', (req, res) => {
  res.send('Hello World')
})


app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});