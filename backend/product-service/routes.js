const express = require('express');
const router = express.Router();
const multer = require('multer');
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

// Add new product
router.post('/addlisting', upload.single('image'), productController.addProduct);

// Get product by ID
router.get('/products/:productId', productController.getProduct);

// Get products by category
router.get('/products/category/:categoryId', productController.getProductsByCategory);

// Get latest products
router.get('/latest-products', productController.getLatestProducts);

module.exports = router;
