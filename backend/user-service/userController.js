const User = require('./userModel');
const axios = require('axios');

exports.uploadProfilePicture = async (req, res) => {
  try {
    console.log('File upload request received:', req.file); 
    const { username } = req.body;
    const profilePictureUrl = `/uploads/${req.file.filename}`;
    console.log('New profile picture path:', profilePictureUrl); 
    const user = await User.findOneAndUpdate({ username }, { profilePicture: profilePictureUrl }, { new: true });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.send({ profilePictureUrl });
  } catch (error) {
    console.error('Error uploading profile picture:', error); 
    res.status(500).send('Error uploading profile picture');
  }
};

exports.getUserFavorites = async (req, res) => {
  try {
    console.log('Fetching favorites for user:', req.params.username); 
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const productIds = user.favorites; 
    console.log('User Favorite Product IDs:', productIds);

    if (productIds.length === 0) {
      return res.json({ favorites: [] });
    }

    const productServiceUrl = 'http://product-service:3002/products/getByIds'; 
    const response = await axios.post(productServiceUrl, { productIds });
    console.log('Products fetched from product service:', response.data.products); 

    res.json({ favorites: response.data.products }); 
  } catch (error) {
    console.error('Error fetching favorites:', error.message);
    res.status(500).send('Error fetching favorites');
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const { productId, username } = req.body;
    const user = await User.findOne({ username });

    const index = user.favorites.indexOf(productId);
    if (index === -1) {
      user.favorites.push(productId);
    } else {
      user.favorites.splice(index, 1);
    }

    await user.save();
    res.json({ message: 'Favorites updated successfully', favorites: user.favorites });
  } catch (error) {
    res.status(500).send('Error updating favorites');
  }
};
