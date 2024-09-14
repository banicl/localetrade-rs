const express = require('express');
const multer = require('multer');
const axios = require('axios');
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

router.get('/user/favorites/:username', getUserFavorites);
router.get('/users-with-products', async (req, res) => {
  try {
    const users = await User.find().lean(); // Get all users

    const usersWithProducts = await Promise.all(
      users.map(async (user) => {
        try {
          // Fetch products for the user from the product-service
          const productServiceUrl = `http://product-service:3002/products/listed/${user.username}?limit=3`;
          const productResponse = await axios.get(productServiceUrl);
          const products = productResponse.data;

          // Calculate average rating if products have reviews
          const allRatings = await Promise.all(
            products.map(async (product) => {
              const reviewsResponse = await axios.get(`http://product-service:3002/reviews/${product._id}`);
              const reviews = reviewsResponse.data.reviews;
              const avgRating = reviews.length
                ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length)
                : 0;
              return avgRating;
            })
          );

          const totalAverageRating = allRatings.length > 0
            ? (allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length).toFixed(1)
            : 'No ratings';

          const productNames = products.length
            ? products.map((p) => p.name).join(', ')
            : 'No listings';

          return {
            username: user.username,
            profilePicture: user.profilePicture,
            productsListed: productNames,
            avgRating: totalAverageRating, 
          };
        } catch (error) {
          console.error(`Error fetching products for ${user.username}:`, error.message);
          return {
            username: user.username,
            profilePicture: user.profilePicture,
            productsListed: 'No listings',
            avgRating: 'No ratings',
          };
        }
      })
    );

    res.json(usersWithProducts);
  } catch (error) {
    console.error('Error fetching users with products:', error.message);
    res.status(500).send('Error fetching users with products');
  }
});


router.post('/user/upload-profile-picture', upload.single('profilePicture'), uploadProfilePicture);
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
