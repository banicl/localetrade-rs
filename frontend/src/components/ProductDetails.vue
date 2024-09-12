<template>
  <div class="product-details-page">
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

    <div class="product-container">
      <div class="product-frame">
        <div class="product-meta">
          <p>Listed by: <b>{{ product.username }}</b></p>
          <p>{{ formatDate(product.createdAt) }}</p>
        </div>

        <img :src="`http://localhost:3002${product.image}`" alt="Product Image" class="product-image">
        <div class="product-info">
          <h2>
            {{ product.name }} 
            <span v-if="averageRating !== null"> 
              <i v-for="n in Math.floor(averageRating)" :key="n" class="fa fa-star"></i> 
              <i v-if="averageRating % 1 !== 0" class="fa fa-star-half-alt"></i> 
              <span class="rating-number">{{ averageRating.toFixed(1) }}</span>
            </span>
          </h2>
          <p style="text-align: center !important;">{{ product.location }}</p>
          <p class="price">{{ product.price }}.00€</p>

          <div class="product-actions">
            <button class="add-to-cart-btn" @click="addToCart(product)">Add to Cart</button>
            <button class="favorite-btn" @click="toggleFavorite(product._id)">
              <i :class="{'fas fa-heart': isFavorite(product._id), 'far fa-heart': !isFavorite(product._id)}"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="reviews-section">
        <h2 style="color:white">USER REVIEWS 📝</h2>
        <div v-if="reviews.length === 0" class="no-reviews">
          <p>No reviews yet. Be the first to review this product! 🌱</p>
        </div>
        <div v-else>
          <div v-for="review in reviews" :key="review._id" class="review-card">
            <div class="review-header">
              <span><b>{{ review.username }}</b></span>
              <span>Rated: {{ review.rating }} ⭐</span>
            </div>
            <p>{{ review.comment }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="add-review-section">
      <h2 style="color:white">✏️ ADD YOUR REVIEW</h2>
      <div class="rating">
        <i v-for="star in 5" :key="star" @click="setRating(star)" 
          :class="{'fas fa-star': star <= newReview.rating, 'far fa-star': star > newReview.rating}" 
          class="star"></i>
      </div>
      <textarea v-model="newReview.comment" placeholder="Write your review here..."></textarea>
      <button @click="submitReview">Submit Review</button>

      <footer class="footer">
        <p><b>&copy; 2024 🌿 LOCALE TRADE. All rights reserved.</b></p>
        <div id="current-date"><span class="date-color"><b>{{ currentDate }}</b></span></div>
      </footer>
    </div>
  </div>
</template>



<script>
import axios from 'axios';

export default {
  name: 'ProductDetails',
  props: ['productId'],
  data() {
    return {
      product: {},
      reviews: [],
      newReview: {
        rating: null,
        comment: '',
      },
      username: null,
      userFavorites: [],
      averageRating: null,
    };
  },
  methods: {
    calculateAverageRating() {
      if (this.reviews.length > 0) {
        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.averageRating = totalRating / this.reviews.length;
      } else {
        this.averageRating = null;
      }
    },
    async fetchProduct() {
      try {
        const response = await axios.get(`http://localhost:3002/products/${this.productId}`);
        this.product = response.data;
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    },
    async fetchReviews() {
      try {
        const response = await axios.get(`http://localhost:3000/reviews/${this.productId}`);
        this.reviews = response.data.reviews;
        this.calculateAverageRating();
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    },
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    async submitReview() {
      if (this.newReview.rating && this.newReview.comment && this.username) {
        try {
          const response = await axios.post(`http://localhost:3000/reviews`, {
            productId: this.productId,
            username: this.username,
            ...this.newReview,
          });
          this.reviews.push(response.data.review);
          this.calculateAverageRating();
          this.newReview.rating = null;
          this.newReview.comment = '';
        } catch (error) {
          console.error('Error submitting review:', error);
        }
      } else {
        alert('Please provide rating, comment, and make sure you are logged in!');
      }
    },
    setRating(star) {
      this.newReview.rating = star;
    },
    addToCart(product) {
      alert(`Product ${product.name} added to cart!`);
    },
    async toggleFavorite(productId) {
      try {
        const response = await axios.post('http://localhost:3000/user/favorites', {
          productId,
          username: this.username,
        });
        this.userFavorites = response.data.favorites;
      } catch (error) {
        console.error('Error updating favorites:', error);
      }
    },
    isFavorite(productId) {
      return this.userFavorites.includes(productId);
    },
    async fetchFavorites() {
      const username = this.username;
      try {
        const response = await axios.get(`http://localhost:3000/user/favorites/${username}`);
        this.userFavorites = response.data.favorites;
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    },
    logout() {
      localStorage.removeItem('user');
      console.log('Logout successful');
      this.$router.push('/login');
    },
  },
  mounted() {
    this.fetchProduct();
    this.fetchReviews();
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.username) {
      this.username = userData.username;
      this.fetchFavorites();
    } else {
      this.$router.push('/login');
    }
  },
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

.product-details-page {
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

.product-container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.product-frame {
  background-color: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.product-meta {
  text-align: center;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.product-meta p {
  margin: 0;
}


.product-image {
  width: 80%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
}

.product-info h2 {
  font-size: 28px;
  margin-bottom: 10px;
}

.product-info h2 span {
  font-size: 18px;
  color: #f5d826;
  margin-left: 10px;
  text-align: center !important;
}

.price {
  font-size: 22px;
  color: #6ba823;
  margin-bottom: 15px;
  text-align: center !important;
}

.product-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.add-to-cart-btn {
  background-color: #6ba823;
  color: white;
  padding: 10px 15px;
  border: none;
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
  font-size: 24px;
  cursor: pointer;
}

.favorite-btn:hover {
  background-color: white;
}

.favorite-btn .fas.fa-heart {
  color: red;
}

.favorite-btn .far.fa-heart {
  color: #ccc;
}

.reviews-section {
  width: 45%;
  padding: 20px;
}

.review-card {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.review-header {
  display: flex;
  color:#6ba823;
  justify-content: space-between;
  margin-bottom: 10px;
}

.add-review-section {
  margin-top: 0px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.rating {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.rating .star {
  font-size: 24px;
  cursor: pointer;
  color: #f5d826;
}

textarea {
  width: 50%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
}

button {
  padding: 10px 20px;
  background-color: #6ba823;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  /* Adjust alignment */
  vertical-align: middle;
  margin-top: 10px; /* Ensure some space between textarea and button */
}

button:hover {
  background-color: #f5d826;
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
