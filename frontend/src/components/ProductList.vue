<template>
  <div class="products-page">
    <nav class="navbar">
      <div class="nav-social">
        <a href="https://www.facebook.com" target="_blank"><i class="fab fa-facebook-f"></i></a>
        <a href="https://www.instagram.com" target="_blank"><i class="fab fa-instagram"></i></a>
        <a href="https://www.tiktok.com" target="_blank"><i class="fab fa-tiktok"></i></a>
      </div>
      <ul class="nav-menu">
        <li><router-link to="/chat-page"><i class="fas fa-comment-dots"> &nbsp;&nbsp;</i></router-link></li>
        <li class="separator"></li>
        <li><router-link to="/newspage">HOME 🏡</router-link></li>
        <li><router-link to="/profile">PROFILE 🍅</router-link></li>
        <li><router-link to="/addlisting">ADD LISTING 🍄</router-link></li>
        <li><a href="#" @click="logout">LOGOUT 🥕</a></li>
      </ul>
    </nav>

    <div class="search-bar">
      <div class="search-container">
        <i class="fas fa-search search-icon"></i> 
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

    <nav class="category-nav">
      <ul class="category-menu">
        <li v-for="category in categories" :key="category.id">
          <router-link :to="{ name: 'ProductList', params: { categoryId: category.id } }">
            {{ category.emoji }}
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="product-grid">
      <div v-for="product in filteredProducts" :key="product._id" class="product-card" @click="goToProduct(product._id)">
        <img :src="`http://localhost:3000${product.image}`" alt="Product Image" class="product-image">
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p v-if="product.averageRating !== null">
            <i v-for="n in Math.floor(product.averageRating)" :key="n" class="fa fa-star"></i>
            <i v-if="product.averageRating % 1 !== 0" class="fa fa-star-half-alt"></i>
            <span class="rating-number">{{ product.averageRating }}</span>
          </p>
          <p>{{ product.location }}</p>
          <p class="price">{{ product.price }}.00€</p>
          <button class="contact-seller-btn" @click.stop="contactSeller(product.username)">Contact Seller</button>
          <button class="favorite-btn" @click.stop="toggleFavorite(product._id)">
            <i :class="{'fas fa-heart': isFavorite(product._id), 'far fa-heart': !isFavorite(product._id)}"></i>
          </button>
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
      userFavorites: [],
      categories: [
        { id: 1, name: 'Fresh Produce', emoji: '🍎' },
        { id: 2, name: 'Dairy Products', emoji: '🧀' },
        { id: 3, name: 'Meat and Poultry', emoji: '🍖' },
        { id: 4, name: 'Baked Goods', emoji: '🍞' },
        { id: 5, name: 'Seafood', emoji: '🐟' },
        { id: 6, name: 'Beverages', emoji: '☕' },
        { id: 7, name: 'Pantry Staples', emoji: '🍯' },
        { id: 8, name: 'Snacks and Confectionery', emoji: '🍫' },
        { id: 9, name: 'Personal Care', emoji: '🧼' },
        { id: 10, name: 'Household Items', emoji: '🏠' }
      ],
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
    async fetchFavorites() {
      try {
        const username = JSON.parse(localStorage.getItem('user')).username;
        const response = await axios.get(`http://localhost:3000/user/favorites/${username}`);
        this.userFavorites = response.data.favorites;
        localStorage.setItem('favorites', JSON.stringify(this.userFavorites)); // Persist to localStorage
      } catch (error) {
        console.error('Error fetching favorites', error);
      }
    },
    isFavorite(productId) {
      return this.userFavorites.some(favorite => favorite === productId);
    },
    async toggleFavorite(productId) {
      try {
        const username = JSON.parse(localStorage.getItem('user')).username;
        const response = await axios.post('http://localhost:3000/user/favorites', {
          productId,
          username
        });
        this.userFavorites = response.data.favorites;
        localStorage.setItem('favorites', JSON.stringify(this.userFavorites));
      } catch (error) {
        console.error('Error updating favorites', error);
      }
    },
    goToProduct(productId) {
      this.$router.push({ name: 'ProductDetails', params: { productId } });
    },
    contactSeller(sellerUsername) {
      this.$router.push({ name: 'ChatDetails', params: { username: sellerUsername } });
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
    this.fetchFavorites();
    setInterval(() => {
      this.currentDate = new Date().toLocaleDateString();
    }, 86400000);
  },
  watch: {
    categoryId() {
      this.fetchProducts(); // Re-fetch products when categoryId changes
    }
  }
};


</script>

<style scoped>

body {
  margin: 0;
  font-family: 'Dosis', sans-serif;
}

.separator {
  border-left: 2px solid white;
  height: 30px;
  margin-left: 40px;
  margin-right: 10px;
}

.products-page {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  min-height: 100vh;
  overflow: auto;
  padding: none;
  margin: none;
  font-family: 'Dosis', sans-serif;
  background: url('@/assets/products-background.png') no-repeat center center; 
  background-size: cover; 
  background-attachment: fixed;
}

.rating-number {
  font-size: 14px;
  color: gray;
  margin-left: 5px;
}

.fa-star, .fa-star-half-alt {
  color: #f5d826;
  font-size: 14px;
}

.navbar {
  width: 100%;
  background-color: rgba(204, 204, 204, 0.3);
  box-shadow: 0 2px 4px #454545;
  padding: 10px 0;
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
  justify-content: flex-end; 
  margin-right: 20px; 
  margin-top: 10px; 
}

.search-container {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 20px; 
  padding: 5px 15px; 
  background-color: white;
  width: 300px; 
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
  color: #bbb; 
}

.category-header {
  text-align: center;
  margin-bottom: 20px;
}

.category-header h2 {
  font-size: 36px;
  color: white;
}

.category-nav {
  padding: 10px 0;
  margin-bottom: 20px;
}

.category-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  gap: 50px;
}

.category-menu li {
  font-size: 24px;
  cursor: pointer;
}

.category-menu li a {
  text-decoration: none;
  color: white;
  transition: color 0.3s ease;
  display: inline-block; /* Add this to allow transform */
  transition: transform 0.3s ease-in-out; /* Smooth hover transition */
}

.category-menu li a:hover {
  color: #f5d826;
  transform: scale(1.5); 
  transition: transform 0.3s ease-in-out; 
}

.category-menu li a:hover {
  color: #f5d826;
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
  cursor:pointer;
}

.product-card:hover {
  transform: translateY(-10px);
  cursor:pointer;
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

.product-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contact-seller-btn {
  background-color: #6ba823;
  color: white;
  border: none;
  padding: 8px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.contact-seller-btn:hover {
  background-color: #f5d826;
}

.fas.fa-heart {
  color: red; /* Filled heart when favorited */
}

.far.fa-heart {
  color: #ccc; /* Empty heart when unfavorited */
}

.favorite-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: red;
}

.favorite-btn:hover {
  color: darkred;
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
