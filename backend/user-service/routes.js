const express = require('express');
const multer = require('multer');
const User = require('./userModel');
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

router.post('/user/favorites/remove', async (req, res) => {
  const { productId, username } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const index = user.favorites.indexOf(productId);
    if (index !== -1) {
      user.favorites.splice(index, 1);
      await user.save();
    }

    res.json({ favorites: user.favorites });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).send('Error removing favorite');
  }
});


module.exports = router;
