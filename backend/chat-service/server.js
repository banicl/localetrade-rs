const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const chatRoutes = require('./routes');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:8080'  
}));

mongoose.connect('mongodb+srv://lbanic:nCnGU4k6@cluster0.cju9yiw.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use('/', chatRoutes);

const PORT = 3004;
app.listen(PORT, () => {
  console.log(`Chat Service running on port ${PORT}`);
});
