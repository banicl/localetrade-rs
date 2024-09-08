<template>
  <div class="news-page">
    <div class="background-image"></div>
    <div class="overlay"></div>

    <nav class="navbar">
      <div class="nav-social">
        <a href="https://www.facebook.com" target="_blank"><i class="fab fa-facebook-f"></i></a>
        <a href="https://www.instagram.com" target="_blank"><i class="fab fa-instagram"></i></a>
        <a href="https://www.tiktok.com" target="_blank"><i class="fab fa-tiktok"></i></a>
      </div>
      <ul class="nav-menu">
        <li><router-link to="/newspage">HOME 🏡</router-link></li>
        <li><router-link to="/profile">PROFILE 🍅</router-link></li>
        <li><router-link to="/addlisting">ADD LISTING 🍄</router-link></li>
        <li><a href="#" @click="logout">LOGOUT 🥕</a></li>
      </ul>
    </nav>

    <div class="content">
      <div class="sidebar-categories">
        <img src="@/assets/logo-static.png" alt="Logo" class="logo-image" />
        <ul>
          <li v-for="category in categories" :key="category.id" class="category-item">
            <router-link :to="{ name: 'ProductList', params: { categoryId: category.id } }">
              {{ category.emoji }} {{ category.name }}
            </router-link>
          </li>
        </ul>
      </div>
      <div class="main-content">
        <div class="news-list">
          <div class="news-card" v-for="news in newsItems" :key="news.id">
            <img :src="news.image" alt="News Image" class="news-image">
            <div class="news-content">
              <h3>{{ news.title }}</h3>
              <p>{{ news.description }}</p>
              <a :href="news.link" target="_blank">Read more...</a>
            </div>
          </div>
        </div>
        <div class="latest-products">
          <h2>🌾 Check Out the Latest Products 🌾</h2>
          <div class="product-grid">
            <div v-for="product in latestProducts" :key="product._id" class="product-card">
              <img :src="`http://localhost:3000${product.image}`" alt="Product Image" class="product-image">
              <div class="product-info">
                <h3>{{ product.name }} ({{ product.price }}.00€)</h3>
                <p>{{ product.location }}</p>
              </div>
            </div>
          </div>
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

import image1 from '@/assets/image1.jpg';
import image2 from '@/assets/image2.jpg';
import image3 from '@/assets/image3.jpg';
import image4 from '@/assets/image4.jpg';

export default {
  name: 'NewsPage',
  data() {
    return {
      currentDate: '',
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
      newsItems: [
        { id: 1, title: 'The Benefits of Eating Fresh Produce', description: 'Learn about the numerous health benefits of consuming fresh fruits and vegetables.', image: image1, link: 'https://www.healthline.com/nutrition/20-healthiest-fruits' },
        { id: 2, title: 'Dairy Products and Your Health', description: 'Explore the nutritional value and health benefits of including dairy products in your diet.', image: image2, link: 'https://www.medicalnewstoday.com/articles/323458' },
        { id: 3, title: 'Sustainable Seafood Choices', description: 'Find out how to make sustainable seafood choices that are good for you and the planet.', image: image3, link: 'https://www.nrdc.org/stories/sustainable-seafood-guide' },
        { id: 4, title: 'Plant-Based Meat', description: 'Discover the latest advancements in plant-based meat alternatives and their impact on the food industry.', image: image4, link: 'https://www.foodnavigator.com/Article/2023/01/15/Plant-based-meat-innovation-trends-to-watch' }
      ],
      latestProducts: [],
    };
  },
  methods: {
    updateDate() {
      this.currentDate = new Date().toLocaleDateString();
    },
    async fetchLatestProducts() {
      try {
        const response = await axios.get('http://localhost:3000/latest-products');
        this.latestProducts = response.data;
      } catch (error) {
        console.error('Error fetching latest products:', error);
      }
    },
    logout() {
      localStorage.removeItem('user');
      console.log('Logout successful');
      this.$router.push('/login');
    }
  },
  mounted() {
    this.updateDate();
    setInterval(this.updateDate, 86400000);

    this.fetchLatestProducts();
  }}
</script>

<style scoped>

body {
  margin: 0;
  font-family: 'Dosis', sans-serif;
}

.news-page, .background-image {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100vh;
}

.news-page {
  overflow: hidden;
  padding: none;
  margin: none;
  font-family: 'Dosis', sans-serif;
}

.news-page h2 {
  font-family: 'Dosis', sans-serif;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); 
  z-index: 1; 
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('@/assets/background-2.jpeg') no-repeat center center;
  background-size: 100%;
  filter: blur(4px);
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

.content {
  position: relative;
  display: flex;
  flex-direction: row;
  height: calc(100% - 60px);
  z-index: 1; 
}

.sidebar-categories {
  width: 20%;
  height: 100%;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 2px 0 4px #454545;
  z-index: 2;
  overflow-y: auto;
}

.sidebar-categories ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar-categories li {
  margin: 10px 0;
  transition: color 0.3s ease;
}

.sidebar-categories li:hover {
  color: #6EA823;
}

.sidebar-categories a {
  text-decoration: none;
  color: inherit;
  transition: color 0.3s ease;
}

.sidebar-categories a:hover {
  color: #6EA823;
}

.category-item {
  margin: 10px 0;
  transition: color 0.3s ease;
  border-bottom: 1px solid #ddd; /* Add this line */
  padding-bottom: 10px; 
}

.category-item:last-child {
  border-bottom: none; /* Remove the border from the last item */
}

.main-content {
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0px 20px;
}

.news-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.news-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between; /* Add this line */
}

.news-card {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px #454545;
  padding: 10px;
  flex: 0 1 calc(23% - 20px); /* Adjusted width to fit three cards */
  display: flex;
  flex-direction: column;
  max-height: 300px;
  transition: background-color 0.3s ease;
}
.news-card:hover {
  background-color: #ddd;
}

.news-image {
  width: 100%;
  height: auto;
  max-height: 150px;
  margin-bottom: 10px;
}

.news-content {
  flex-grow: 1;
  overflow: hidden;
}

.news-card h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 18px;
}

.news-card p {
  font-size: 14px;
  margin-bottom: 10px;
}

.news-card h3 {
  margin-top: 0;
}

.news-card a {
  color: #6ba823;
  text-decoration: none;
  transition: color 0.3s ease;
}

.news-card a:hover {
  color: #F5d826;
}

.latest-products {
  background-color: white;
  padding: 10px;
  box-shadow: 0 2px 4px #454545;
  min-height: 500px; /* Set max height */
}

.latest-products h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #6ba823;
}

.latest-products .product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2px; /* Reduce the gap between cards */
  justify-content: space-between; /* Spread them evenly */
}

.latest-products .product-card {
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  width: 15%; /* Reduce width so four cards fit in one row */
  text-align: center;
  transition: transform 0.3s ease;
}

.latest-products .product-card:hover {
  transform: translateY(-10px);
}

.latest-products .product-image {
  width: 100%;
  height: 80px; /* Smaller image size */
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
}

.latest-products .product-info h3 {
  font-size: 16px; /* Reduce text size */
  margin-bottom: 5px;
  color: #6ba823;
}

.latest-products .product-info p {
  font-size: 14px;
  margin-bottom: 5px;
  color: #333;
}

.latest-products .price {
  font-size: 16px; /* Slightly smaller price text */
  font-weight: bold;
  color: #F5d826;
}

.latest-products .view-details {
  background-color: #6ba823;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.latest-products .view-details:hover {
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
  background: url('@/assets/background-2.jpeg') no-repeat center center;
  background-size: cover; /* Ensure the background covers the whole area */
  box-shadow: 0 -2px 5px #454545;
  font-family: 'Dosis', sans-serif;
  overflow: hidden; /* Ensure the pseudo-element stays inside the footer */
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(000, 000, 000, 0.5); /* 50% opacity white overlay */
  z-index: 1; /* Ensure the overlay is behind the text */
}

.footer p, .footer #current-date {
  position: relative;
  z-index: 2; /* Ensure the text stays above the overlay */
}

.logo-image {
  max-width: 100%;
  z-index: 1;
  height: auto;
  padding: none;
  margin-bottom: 10px;
}

</style>

