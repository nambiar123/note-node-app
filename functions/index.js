const functions = require('firebase-functions');
const express = require('express');
const User = require('./models/userschema');
const Note = require('./models/noteschema');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://adithyakumar53:7v2TFVi8mB0fEiTc@cluster0.0b2x4v6.mongodb.net/note';


// Enable CORS for all routes
app.use(cors());
// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
  });
// Define a sample route
app.get('/', (req, res) => {
  res.send('endpoint note apis!');
});

// Define other routes here...
app.post('/signup', async (req, res) => {
    try {
      const { username, password, mobileNumber } = req.body;
  
      // Check if the username already exists
      const existingUser = await User.findOne({ mobileNumber });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
  // Connection event listeners

  
      // Create a new user
     const user = new User({ username, password, mobileNumber });
      //Hash password before saving (You should use a library like bcrypt for this)
   //   user.password = await bcrypt.hash(password, 10);
      
     await user.save();
      return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  });

  app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username, password }).exec();
  
      if (user) {
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });


  app.post('/note', async (req, res) => {
    try {
      const {  title, text, color } = req.body;
  
      // Create a new Note instance
      const newNote = new Note({
        title,
        text,
        color
      });
  
      // Save the new note to the database
      await newNote.save();
  
      res.status(201).json({ message: 'Note created successfully', note: newNote });
    } catch (error) {
      console.error('Error creating note:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.put('/note/:id', async (req, res) => {
    try {
      const { id } = req.params; // Get the note ID from the request parameters
      const { title, text, color } = req.body; // Updated fields
  
      // Find the note by ID and update its fields
      const updatedNote = await Note.findByIdAndUpdate(
        id,
        {  text },
        { new: true } // Return the updated note after the operation
      );
  
      if (!updatedNote) {
        return res.status(404).json({ error: 'Note not found' });
      }
  
      res.status(200).json({ message: 'Note updated successfully', note: updatedNote });
    } catch (error) {
      console.error('Error updating note:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.delete('/note/:id', async (req, res) => {
    try {
      const { id } = req.params; // Get the note ID from the request parameters
  
      // Find the note by ID and delete it
      const deletedNote = await Note.findByIdAndDelete(id);
  
      if (!deletedNote) {
        return res.status(404).json({ error: 'Note not found' });
      }
  
      res.status(200).json({ message: 'Note deleted successfully', note: deletedNote });
    } catch (error) {
      console.error('Error deleting note:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.get('/notes', async (req, res) => {
    try {
      // Fetch all notes from the database
      const allNotes = await Note.find({});
  
      res.status(200).json({ notes: allNotes });
    } catch (error) {
      console.error('Error fetching notes:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
// Create a HTTP function which triggers the Express app
exports.api = functions.https.onRequest(app);
