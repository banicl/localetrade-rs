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
    <div class="search-bar">
      <div class="search-container">
        <i class="fas fa-search search-icon"></i> <!-- Search icon -->
        <input
          type="text"
          placeholder="Search products..."
          v-model="searchTerm"
        />
      </div>
    </div>
    <div class="category-header">
      <h2>{{ categoryName }}</h2>
    </div>

    <div class="product-grid">
      <div v-for="product in filteredProducts" :key="product._id" class="product-card">
        <img :src="`http://localhost:3000${product.image}`" alt="Product Image" class="product-image">
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p>{{ product.location }}</p>
          <p class="price">{{ product.price }}.00€</p>
          <button class="view-details">View Details</button>
        </div>
        <div class="product-date">
          <span>Listed by: <b>{{ product.username }}</b> on {{ formatDateTime(product.createdAt) }}</span>
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
      products: [],
      currentDate: new Date().toLocaleDateString(),
      searchTerm: '', 
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.location.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get(`http://localhost:3000/products/category/${this.categoryId}`);
        this.products = response.data.products;
        this.categoryName = response.data.categoryName;
      } catch (error) {
        console.error('Error fetching products', error);
      }
    },
    formatDateTime(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    logout() {
      localStorage.removeItem('user');
      this.$router.push('/login');
    }
  },
  mounted() {
    this.fetchProducts();
    setInterval(() => {
      this.currentDate = new Date().toLocaleDateString();
    }, 86400000);
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
  overflow: auto;
  padding: none;
  margin: none;
  font-family: 'Dosis', sans-serif;
  background: url('@/assets/products-background.png') no-repeat center center; /* Add the background image */
  background-size: cover; /* Ensure the background covers the entire page */
  background-attachment: fixed;
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

.search-bar {
  display: flex;
  justify-content: flex-end; /* Moves the search bar to the right */
  margin-right: 20px; /* Adjust margin to position */
  margin-top: 10px; /* Optional: add space between menu and search */
}

.search-container {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 20px; /* Rounded corners for better look */
  padding: 5px 15px; /* Padding to make the input field look cleaner */
  background-color: white;
  width: 300px; /* Adjust width as needed */
}

.search-icon {
  color: #999;
  margin-right: 10px;
}

.search-bar input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 16px;
  background: none;
}

.search-bar input::placeholder {
  color: #bbb; /* Placeholder text color */
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
  gap: 15px;
  justify-content: center;
}

.product-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  width: 220px;
  text-align: center;
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-10px);
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.user-profile-picture {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.username {
  font-size: 14px;
  color: #333;
}

.product-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
}

.product-info h3 {
  font-size: 20px;
  margin-bottom: 8px;
  color: #6ba823;
}

.product-info p {
  margin-bottom: 8px;
  font-size: 16px;
}

.price {
  font-size: 18px;
  font-weight: bold;
  color: #F5d826;
}

.view-details {
  background-color: #6ba823;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.view-details:hover {
  background-color: #f5d826;
}

.product-date {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
  margin-top: 10px;
}

.footer {
  bottom: 0;
  width: 100%;
  color: white;
  text-align: center;
  padding-bottom: 15px;
  padding-top: 15px;
  margin-top: 15px;
  z-index: 2;
  background-color: rgba(204, 204, 204, 0.3);
  box-shadow: 0 -2px 5px #454545;
  font-family: 'Dosis', sans-serif;
}
</style>
