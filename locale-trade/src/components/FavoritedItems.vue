<template>
  <div class="favorited-items-page">
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

    <div class="category-header">
      <h2>FAVORITED ITEMS ❤️</h2>
    </div>

    <div v-if="favoritedProducts.length === 0" class="no-favorites">
      <p>There are no products in your Favorited items.</p>
      <router-link to="/category/1">Add products to your favorites. 🍎</router-link> 
    </div>

    <div class="product-grid">
      <div v-for="product in favoritedProducts" :key="product._id" class="product-card">
        <img :src="`http://localhost:3000${product.image}`" alt="Product Image" class="product-image">
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p>{{ product.location }}</p>
          <p class="price">{{ product.price }}.00€</p>
          <div class="product-actions">
            <button class="add-to-cart-btn" @click="addToCart(product)">Add to Cart</button>
            <button class="favorite-btn" @click="removeFavorite(product._id)">
              <i class="fas fa-heart"></i>
            </button>
          </div>
        </div>
        <div class="product-date">
          <span>Listed by: <b>{{ product.username }}</b> on {{ formatDateTime(product.createdAt) }}</span>
        </div>
      </div>
    </div>

    <footer class="footer">
      <p><b>&copy; 2024 🌿 LOCALE TRADE. All rights reserved.</b></p>
    </footer>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FavoritedItems',
  data() {
    return {
      favoritedProducts: [],
      userFavorites: JSON.parse(localStorage.getItem('favorites')) || [],
    };
  },
  methods: {
    async fetchFavoritedProducts() {
      try {
        const username = JSON.parse(localStorage.getItem('user')).username;
        const response = await axios.get(`http://localhost:3000/user/favorites/${username}`);
        this.favoritedProducts = response.data.favorites;
      } catch (error) {
        console.error('Error fetching favorited products', error);
      }
    },

    async removeFavorite(productId) {
      try {
        const username = JSON.parse(localStorage.getItem('user')).username;
        const response = await axios.post('http://localhost:3000/user/favorites/remove', {
          productId,
          username
        });

        this.favoritedProducts = this.favoritedProducts.filter(product => product._id !== productId);
        this.userFavorites = response.data.favorites;
        localStorage.setItem('favorites', JSON.stringify(this.userFavorites));

      } catch (error) {
        console.error('Error removing favorite', error);
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
    this.fetchFavoritedProducts();
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

.favorited-items-page {
  position: absolute;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100vh;
  overflow: auto;
  padding: none;
  margin: none;
  font-family: 'Dosis', sans-serif;
  background: url('@/assets/favorites.png') no-repeat center center; 
  background-size: cover; 
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

.category-header {
  text-align: center;
  margin-bottom: 40px;
}

.category-header h2 {
  font-size: 36px;
  color: white;
}

.no-favorites {
  text-align: center;
  font-size: 18px;
  margin-top: 140px;
  margin-bottom: 290px;
}

.no-favorites p {
  margin-bottom: 10px;
}

.no-favorites a {
  color: #f5d826;
  font-weight: bold;
  text-decoration: none;
}

.no-favorites a:hover {
  color: rgb(205, 0, 0);
}

.product-grid {
  flex-grow: 1;
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
  height:400px;
  text-align: center;
  transition: transform 0.3s ease;
}
.product-card:hover {
  transform: translateY(-10px);
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
.add-to-cart-btn {
  background-color: #6ba823;
  color: white;
  border: none;
  padding: 8px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-to-cart-btn:hover {
  background-color: #f5d826;
}

.favorite-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: red; /* Red heart by default */
}

.favorite-btn:hover .fa-heart {
  display: none;
}

.favorite-btn:hover::after {
  content: "\f7a9";
  font-family: "Font Awesome 5 Free"; 
  font-weight: 900;
  color: red;
}

.product-date {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
  margin-top: 10px;
}
.footer {
  margin-top: auto;
  text-align: center;
  padding: 15px;
  background-color: rgba(204, 204, 204, 0.3);
  box-shadow: 0 -2px 5px #454545;
  font-family: 'Dosis', sans-serif;
  color: white;
}
</style>
