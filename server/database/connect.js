const mongoose = require('mongoose');

 
const uri =process.env.MONGODB_URI;

if (!uri) {
    console.error('MongoDB URI not found in environment variables');
    process.exit(1);  
  }

// Async function to connect to the database
const connectToDatabase = async () => {
  try {
    
    await mongoose.connect(uri, {
        
    });
    console.log('Connected to the database');
  } catch (err) {
    // Handle any connection errors
    console.error('Error connecting to the database', err);
    process.exit(1);  
  }
};

// Call the async function to initiate the connection
connectToDatabase();

module.exports = mongoose;
