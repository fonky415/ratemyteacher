// models/Professor.js

const mongoose = require('mongoose');

const ProfessorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  ratings: [{ type: Number }],      // list of numeric ratings (1–5)
  reviews: [{ type: String }]       // list of written reviews
});

module.exports = mongoose.model('Professor', ProfessorSchema);
