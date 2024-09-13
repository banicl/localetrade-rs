const express = require('express');
const multer = require('multer');
const { uploadProfilePicture, getUserFavorites, toggleFavorite } = require('./userController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post('/user/upload-profile-picture', upload.single('profilePicture'), uploadProfilePicture);
router.get('/user/favorites/:username', getUserFavorites);
router.post('/user/favorites', toggleFavorite);

module.exports = router;
