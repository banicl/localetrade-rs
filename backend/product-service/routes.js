const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const Product = require('./productModel');
const productController = require('./productController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.post('/addlisting', upload.single('image'), productController.addProduct);
router.post('/reviews', productController.addReview);
router.post('/products/getByIds', async (req, res) => {
  const { productIds } = req.body;
  console.log('Fetching Products by IDs:', productIds); // Log the incoming IDs

  try {
    // Validate if productIds are valid ObjectIds
    if (!productIds || !productIds.every(id => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).send('Invalid product ID(s)');
    }

    const products = await Product.find({ _id: { $in: productIds } }); // Ensure Product model is used here
    console.log('Products found:', products); // Log found products

    if (products.length === 0) {
      return res.status(404).send('No products found');
    }

    res.json({ products });
  } catch (error) {
    console.error('Error fetching products by IDs:', error); // Log the exact error
    res.status(500).send('Error fetching products');
  }
});

router.get('/products/:productId', productController.getProduct);
router.get('/products/category/:categoryId', productController.getProductsByCategory);
router.get('/products/listed/:username', productController.getProductsByUsername);
router.get('/latestproducts', productController.getLatestProducts);
router.get('/reviews/:productId', productController.getReviewsForProduct);



router.delete('/products/:productId', productController.deleteProduct);


module.exports = router;
