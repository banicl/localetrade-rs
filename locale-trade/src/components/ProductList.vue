<template>
  <div class="products-page">

    <nav class="navbar">
      <div class="nav-social">
        <a href="https://www.facebook.com" target="_blank"><i class="fab fa-facebook-f"></i></a>
        <a href="https://www.instagram.com" target="_blank"><i class="fab fa-instagram"></i></a>
        <a href="https://www.tiktok.com" target="_blank"><i class="fab fa-tiktok"></i></a>
      </div>
      <ul class="nav-menu">
        <li><router-link to="/newspage">HOME 🏡</router-link></li>
        <li><a href="#" @click="logout">LOGOUT 🥕</a></li>
      </ul>
    </nav>

    <div class="category-header">
      <h2>{{ categoryName }}</h2>
    </div>
    <div class="product-grid">
    <div v-for="product in products" :key="product._id" class="product-card">
      <img :src="`http://localhost:3000${product.image}`" alt="Product Image" class="product-image">
      <div class="product-info">
        <h3>{{ product.name }}</h3>
        <p>{{ product.location }}</p>
        <p class="price">${{ product.price }}</p>
        <button class="view-details">View Details</button>
      </div>
    </div>
  </div>
    <footer class="footer">
      <p><b>&copy; 2024 🌿 LOCALE TRADE. All rights reserved.</b></p>
      <div id="current-date"><span class="date-color"><b>{{ currentDate }}</b></span></div>
    </footer>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProductList',
  props: ['categoryId'],
  data() {
    return {
      categoryName: '',
      products: []
    };
  },
  methods: {
    async fetchProducts() {
    try {
      const response = await axios.get(`http://localhost:3000/products/category/${this.categoryId}`);
      console.log(response.data); // Log the entire response to check data structure
      this.products = response.data.products;
      this.categoryName = response.data.categoryName;
    } catch (error) {
      console.error('Error fetching products', error);
    }
  }
  },
  mounted() {
    this.fetchProducts();
  }
};
</script>

<style scoped>

body {
  margin: 0;
  font-family: 'Dosis', sans-serif;
}

.products-page {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100vh;
  overflow: hidden;
  padding: none;
  margin: none;
  font-family: 'Dosis', sans-serif;
  background-color:brown;
  }

.navbar {
  position: relative; 
  z-index: 2;
  width: 100%;
  background-color: rgba(204, 204, 204, 0.3);
  box-shadow: 0 2px 4px #454545;
  padding: 10px 0;
  margin: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 20px;
}

.nav-menu li {
  margin-left: 20px;
}

.nav-menu a {
  text-decoration: none;
  color: white;
  font-weight: bold;
  font-family: 'Dosis', sans-serif;
  font-size: 20px;
  transition: color 0.3s ease;
}

.nav-menu a:hover {
  color: #F5d826;
}

.nav-social {
  padding-left: 20px;
}

.nav-social a {
  color: white;
  margin-right: 10px;
  font-size: 20px;
  transition: color 0.3s ease;
}

.nav-social a:hover {
  color: #F5d826;
}

.category-header {
  text-align: center;
  margin-bottom: 40px;
}

.category-header h2 {
  font-size: 36px;
  color: #6ba823;
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px; /* Reduce gap between product cards */
  justify-content: center;
}

.product-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 15px; /* Reduced padding */
  width: 220px; /* Make the cards smaller */
  text-align: center;
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-10px);
}

.product-image {
  width: 100%;
  height: 150px; /* Reduced height */
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px; /* Adjust margin for smaller size */
}

.product-info h3 {
  font-size: 20px; /* Make text slightly smaller */
  margin-bottom: 8px;
  color: #6ba823;
}

.product-info p {
  margin-bottom: 8px;
  font-size: 16px; /* Adjust description font size */
}

.price {
  font-size: 18px; /* Slightly smaller price text */
  font-weight: bold;
  color: #F5d826;
}

.view-details {
  background-color: #6ba823;
  color: white;
  border: none;
  padding: 8px 15px; /* Adjust button padding */
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.view-details:hover {
  background-color: #f5d826;
}


.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  color: white;
  text-align: center;
  padding-bottom: 15px;
  z-index: 2;
  background-color: rgba(204, 204, 204, 0.3);
  box-shadow: 0 -2px 5px #454545;
  font-family: 'Dosis', sans-serif;
}

</style>
