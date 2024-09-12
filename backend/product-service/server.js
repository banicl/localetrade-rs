const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const productRoutes = require('./routes');

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:8080'
}));

// Connect to MongoDB
mongoose.connect('mongodb://mongo:27017/localetrade', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB successfully!");
});

app.use('/', productRoutes);

const PORT = process.env.PORT || 3002; // Different port for product-service
app.listen(PORT, () => console.log(`Product Service running on port ${PORT}`));
