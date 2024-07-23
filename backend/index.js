const express = require('express');  // Import express
const mongoose = require('mongoose');  // Import mongoose
const cors = require('cors');  // Import cors
const dotenv = require('dotenv');  // Import dotenv for environment variables
const authRoutes = require('./routes/auth');  // Import auth routes

dotenv.config();  // Load environment variables from .env file

const app = express();  // Create an express app

app.use(cors());  // Use CORS middleware
app.use(express.json());  // Use JSON parser middleware

// Log the environment variables
console.log('MongoDB URI:', process.env.MONGO_URI);
console.log('JWT Secret:', process.env.JWT_SECRET);
console.log('API URL:', process.env.REACT_APP_API_URL);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Init Middleware
app.use(express.json({ extended: false }));

app.use('/api/auth', authRoutes);  // Use auth routes under /api/auth
app.use('/api/transaction', require('./routes/transaction'));  // Assuming you have a transaction route

const PORT = process.env.PORT || 5000;  // Set the port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  // Start the server