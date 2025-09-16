const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware (like security guards for your server)
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://expense-tracker-frontend-37i9.onrender.com'
  ],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB! 🎉'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes (like different doors in your house)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/expenses', require('./routes/expenses'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});