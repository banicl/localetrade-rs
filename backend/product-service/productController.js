const Product = require('./productModel');
const Review = require('./reviewModel');

exports.addProduct = async (req, res) => {
  try {
      console.log('Incoming product data:', req.body);
      const { name, price, location, category, username } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : null;

      if (!name || !price || !location || !category || !username) {
          return res.status(400).send('Missing required fields');
      }

      const newProduct = new Product({ name, price, location, category, image, username });
      await newProduct.save();
      res.status(201).send('Product added successfully');
  } catch (error) {
      console.error('Error adding product:', error); // Log exact error
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

    res.json({ products: productsWithRatings });
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
};

exports.getProductsByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const products = await Product.find({ username }); // Find all products listed by the user
    if (!products.length) {
      return res.status(404).send('No products found for this user');
    }
    res.json(products);
  } catch (error) {
    res.status(500).send('Error fetching products by user');
  }
};

exports.getLatestProducts = async (req, res) => {
  try {
    const latestProducts = await Product.find().sort({ createdAt: -1 }).limit(5);
    const productsWithReviews = await Promise.all(
      latestProducts.map(async (product) => {
        const reviews = await Review.find({ productId: product._id });
        const averageRating = reviews.length > 0
          ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
          : 'No reviews';  // Assign 'No reviews' if there are no reviews
        
        return { ...product._doc, averageRating };
      })
    );
    res.json(productsWithReviews);
  } catch (error) {
    res.status(500).send('Error fetching latest products');
  }
};

exports.getReviewsForProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId });
    if (!reviews.length) {
      return res.status(404).send('No reviews found for this product');
    }
    res.json({ reviews });
  } catch (error) {
    res.status(500).send('Error fetching reviews');
  }
};

exports.addReview = async (req, res) => {
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
    res.status(500).send('Error adding review');
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).send('Product not found');
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).send('Error deleting product');
  }
};


exports.getProductsByIds = async (req, res) => {
  try {
    const { productIds } = req.body;
    const products = await Product.find({ _id: { $in: productIds } });

    res.json({ products });
  } catch (error) {
    console.error('Error fetching products by IDs:', error);
    res.status(500).send('Error fetching products');
  }
};