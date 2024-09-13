const User = require('./userModel');

exports.uploadProfilePicture = async (req, res) => {
  try {
    const { username } = req.body;
    const profilePictureUrl = `/uploads/${req.file.filename}`;
    const user = await User.findOneAndUpdate({ username }, { profilePicture: profilePictureUrl }, { new: true });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.send({ profilePictureUrl });
  } catch (error) {
    res.status(500).send('Error uploading profile picture');
  }
};

exports.getUserFavorites = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).populate('favorites');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json({ favorites: user.favorites });
  } catch (error) {
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
