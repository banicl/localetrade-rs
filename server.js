const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer'); 
const User = require('./models/User');
const path = require('path'); 
const Product = require('./models/Product');

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
});

app.post('/upload-profile-picture', upload.single('profilePicture'), async (req, res) => {
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
});

app.post('/addlisting', upload.single('image'), async (req, res) => {
  const { name, price, location, category } = req.body; // `category` here should be the category ID
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newProduct = new Product({ name, price, location, category, image });
    await newProduct.save();
    res.status(201).send('Product added successfully');
  } catch (error) {
    res.status(500).send('Error adding product');
  }
});

app.get('/products/category/:categoryId', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId });
    const categoryMapping = {
      1: 'Fresh Produce',
      2: 'Dairy Products',
      3: 'Meat and Poultry',
      4: 'Baked Goods',
      5: 'Seafood',
      6: 'Beverages',
      7: 'Pantry Staples',
      8: 'Snacks and Confectionery',
      9: 'Personal Care',
      10: 'Household Items'
    };

    const categoryName = categoryMapping[req.params.categoryId] || 'Unknown Category';
    
    res.json({
      products,
      categoryName
    });
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
