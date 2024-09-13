const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const productRoutes = require('./routes');

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:8080'
}));

mongoose.connect('mongodb+srv://lbanic:nCnGU4k6@cluster0.cju9yiw.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
console.log("Connected to MongoDB successfully!");
});


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/', productRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Product Service running on port ${PORT}`));
