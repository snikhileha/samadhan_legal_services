// mongoose.js
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const url = process.env.DATABASE;

mongoose.connect(`${url}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;
