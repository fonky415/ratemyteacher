// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://ratemyteacher:ratemyteacherplease@teacher-data.gnavxew.mongodb.net/?retryWrites=true&w=majority&appName=teacher-data';

// Connect to MongoDB Atlas
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Import Professor model
const Professor = require('./models/Professor');

// Test route
app.get('/', (req, res) => {
  res.send('Hello from your RateMyProfessor clone backend!');
});

/**
 * Route to add a new professor
 * POST /professors
 * { "name": "John Doe", "department": "Math" }
 */
app.post('/professors', async (req, res) => {
  try {
    const { name, department } = req.body;
    const prof = new Professor({ name, department, ratings: [], reviews: [] });
    await prof.save();
    res.status(201).json(prof);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add professor' });
  }
});

/**
 * Route to get all professors
 * GET /professors
 */
app.get('/professors', async (req, res) => {
  try {
    const profs = await Professor.find();
    res.json(profs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get professors' });
  }
});

/**
 * Route to add a rating and review to a professor
 * POST /professors/:id/rate
 * { "rating": 5, "review": "Great teacher!" }
 */
app.post('/professors/:id/rate', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;

    const prof = await Professor.findById(id);
    if (!prof) return res.status(404).json({ error: 'Professor not found' });

    if (rating) prof.ratings.push(rating);
    if (review) prof.reviews.push(review);

    await prof.save();
    res.json(prof);
  } catch (err) {
    res.status(500).json({ error: 'Failed to rate professor' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
