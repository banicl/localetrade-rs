const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const authRoutes = require('./routes'); // Import the routes

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:8080' 
}));

// For handling profile picture uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Serve static files for profile pictures
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect('mongodb://mongo:27017/localetrade', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Routes for authentication
app.use('/auth', authRoutes);

// Start the Auth Service
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
