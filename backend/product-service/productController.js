const Product = require('./productModel');
const Review = require('./reviewModel'); // Assuming Review is in a separate model

exports.addProduct = async (req, res) => {
  try {
    const { name, price, location, category, username } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !price || !location || !category || !username) {
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
    res.status(500).send('Error adding product');
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.json(product);
  } catch (error) {
    res.status(500).send('Error fetching product details');
  }
};

exports.getProductsByCategory = async (req, res) => {
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
};

exports.getLatestProducts = async (req, res) => {
  try {
    const latestProducts = await Product.find().sort({ createdAt: -1 }).limit(5); // Assuming createdAt field exists
    res.json(latestProducts);
  } catch (error) {
    res.status(500).send('Error fetching latest products');
  }
};

exports.deleteProduct = async (req, res) => {
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
};
