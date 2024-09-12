const express = require('express');
const { registerUser, loginUser, uploadProfilePicture } = require('./authController');
const multer = require('multer');

const router = express.Router();

// Setup multer for profile picture uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/upload-profile-picture', upload.single('profilePicture'), uploadProfilePicture);

module.exports = router;
