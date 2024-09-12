const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const Product = require('./models/Product');
const Review = require('./models/Review');

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

// Connect to MongoDB
mongoose.connect('mongodb://mongo:27017/localetrade', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.post('/addlisting', upload.single('image'), async (req, res) => {
    try {
        const { name, price, location, category, username } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;
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
        res.json(productsWithRatings);
    } catch (error) {
        res.status(500).send('Error fetching products');
    }
});

app.get('/latest-products', async (req, res) => {
    try {
        const latestProducts = await Product.find().sort({ createdAt: -1 }).limit(5);
        res.json(latestProducts);
    } catch (error) {
        res.status(500).send('Error fetching latest products');
    }
});

// Reviews
app.get('/reviews/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId });
        res.json(reviews);
    } catch (error) {
        res.status(500).send('Error fetching reviews');
    }
});

app.post('/reviews', async (req, res) => {
    try {
        const { productId, username, rating, comment } = req.body;
        const newReview = new Review({ productId, username, rating, comment });
        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).send('Error adding review');
    }
});

const PORT = process.env.PORT || 3002; // Use a different port for the Product service
app.listen(PORT, () => console.log(`Product Service running on port ${PORT}`));
