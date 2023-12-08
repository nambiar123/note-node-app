const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String },
  time: { type: Date, default: Date.now },
  color: { type: String, default: 'white' } // Assuming default color is 'white'
});

const Note = mongoose.model('Note', noteSchema, 'note');

module.exports = Note;
