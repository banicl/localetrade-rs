const bcrypt = require('bcrypt');
const User = require('./authModel');

// Register new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).send('Username or Email is already taken.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).send('Error registering user');
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid credentials');
    }
    res.send({
      message: 'Login successful',
      user: {
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture 
      }
    });
  } catch (error) {
    res.status(500).send('Error logging in user');
  }
};

// Upload profile picture
const uploadProfilePicture = async (req, res) => {
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

module.exports = { registerUser, loginUser, uploadProfilePicture };
