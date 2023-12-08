const mongoose = require('mongoose');

// Replace 'mongodb://localhost:27017/mydatabase' with your MongoDB connection string
const mongoURI = 'mongodb+srv://adithyakumar53:7v2TFVi8mB0fEiTc@cluster0.0b2x4v6.mongodb.net/note';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connection event listeners
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

// Checking if Mongoose connection is open
if (mongoose.connection.readyState !== 1) {
  console.log('Mongoose is not connected to MongoDB');
}

// More application logic...

// Close the Mongoose connection when your application exits (optional)
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
