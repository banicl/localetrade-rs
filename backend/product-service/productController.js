const Product = require('./productModel');

// Add a product listing
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

// Get product by ID
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

// Fetch products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId });
    res.json(products);
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
};
