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

router.post('/addlisting', upload.single('image'), productController.addProduct);
router.get('/products/:productId', productController.getProduct);
router.get('/products/category/:categoryId', productController.getProductsByCategory);
router.get('/latestproducts', productController.getLatestProducts);
router.get('/reviews/:productId', productController.getReviewsForProduct);
router.post('/reviews', productController.addReview);

module.exports = router;
