const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer'); 
const path = require('path'); 
const User = require('./models/User');
const Product = require('./models/Product');
const Review = require('./models/Review');

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
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
    
    // Log the path for debugging
    console.log('Saving file to:', profilePictureUrl);
    
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
  try {
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);

    const { name, price, location, category, username } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !price || !location || !category || !username ) {
      console.error('Missing required fields');
      return res.status(400).send('Missing required fields');
    }

    const newProduct = new Product({
      name,
      price,
      location,
      category,
      image,
      username,
    });

    await newProduct.save();
    res.status(201).send('Product added successfully');
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).send('Error adding product');
  }
});

app.get('/products/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.json(product);
  } catch (error) {
    res.status(500).send('Error fetching product details');
  }
});

app.post('/user/favorites', async (req, res) => {
  const { productId, username } = req.body;

  try {
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const index = user.favorites.indexOf(productId);

    if (index === -1) {
      user.favorites.push(productId);
    } else {
      user.favorites.splice(index, 1);
    }

    await user.save();
    res.json({ message: 'Favorites updated successfully', favorites: user.favorites });

  } catch (error) {
    console.error('Error updating favorites', error);
    res.status(500).json({ message: 'Error updating favorites' });
  }
});

app.get('/reviews/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId });
    res.json({ reviews });
    console.log('Reviews for product:', req.params.productId);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).send('Error fetching reviews');
  }
});

app.post('/reviews', async (req, res) => {
  try {
    const { productId, username, rating, comment } = req.body;
    
    if (!username || !productId || !rating || !comment) {
      return res.status(400).send('Missing required fields');
    }

    const newReview = new Review({
      productId,
      username,
      rating,
      comment,
    });

    await newReview.save();
    res.status(201).json({ review: newReview });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).send('Error adding review');
  }
});

app.post('/user/favorites/remove', async (req, res) => {
  const { username, productId } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).send({ message: 'User not found' });

    // Remove product from favorites
    user.favorites = user.favorites.filter(id => id.toString() !== productId);
    await user.save();

    res.status(200).send({ favorites: user.favorites });
  } catch (error) {
    res.status(500).send({ message: 'Error removing favorite', error });
  }
});


app.get('/user/favorites/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).populate('favorites');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ favorites: user.favorites });
  } catch (error) {
    console.error('Error fetching favorites', error);
    res.status(500).json({ message: 'Error fetching favorites' });
  }
});

app.get('/', (req, res) => {
  res.send('API is working!');
});

app.get('/products/category/:categoryId', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId });
    
    const productsWithRatings = await Promise.all(products.map(async (product) => {
      const reviews = await Review.find({ productId: product._id });
      const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : null;

      return { ...product._doc, averageRating };
    }));

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
      products: productsWithRatings,
      categoryName
    });
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
});

app.get('/latest-products', async (req, res) => {
  try {
    const latestProducts = await Product.find().sort({ createdAt: -1 }).limit(5); // Assuming `createdAt` is the field for listing date
    res.json(latestProducts);
  } catch (error) {
    res.status(500).send('Error fetching latest products');
  }
});

app.get('/products/listed/:username', async (req, res) => {
  try {
    const products = await Product.find({ username: req.params.username });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listed items' });
  }
});

app.delete('/products/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
