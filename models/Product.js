const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false, // Image is optional
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
