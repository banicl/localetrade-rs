const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer'); 
const User = require('./models/User');
const path = require('path'); 

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:8080' 
}));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb+srv://lbanic:nCnGU4k6@cluster0.cju9yiw.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB successfully!");
});

app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      const errorMessage = existingUser.username === username
        ? 'Username is already taken.'
        : 'Email is already taken.';
      return res.status(400).send(errorMessage);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ user });
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

app.post('/login', async (req, res) => {
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

    res.json({ user });
  } catch (error) {
    res.status(500).send('Error logging in user');
  }
});

app.post('/upload-profile-picture', upload.single('profilePicture'), async (req, res) => {
  const userId = req.body.userId; // Assume userId is sent with the request
  const profilePictureUrl = `http://localhost:3000/uploads/${req.file.filename}`;

  try {
    await User.findByIdAndUpdate(userId, { profilePicture: profilePictureUrl });
    res.json({ profilePictureUrl });
  } catch (error) {
    res.status(500).send('Error updating profile picture');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
