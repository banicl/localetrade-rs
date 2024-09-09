<template>
  <div class="product-details-page">
    <div class="product-header">
      <img :src="`http://localhost:3000${product.image}`" alt="Product Image" class="product-image">
      <div class="product-info">
        <h2>
          {{ product.name }} 
          <span v-if="averageRating !== null"> <!-- Only display if there's a rating -->
      <i v-for="n in Math.floor(averageRating)" :key="n" class="fa fa-star"></i> 
      <i v-if="averageRating % 1 !== 0" class="fa fa-star-half-alt"></i> 
      <span class="rating-number">{{ averageRating.toFixed(1) }}</span>
    </span>
        </h2>
        <p>{{ product.location }}</p>
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
      <h3>⭐ Reviews</h3>
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

    <div class="add-review-section">
      <h3>Add Your Review</h3>
      <div class="rating">
        <i v-for="star in 5" :key="star" @click="setRating(star)" 
          :class="{'fas fa-star': star <= newReview.rating, 'far fa-star': star > newReview.rating}" 
          class="star"></i>
      </div>
      <textarea v-model="newReview.comment" placeholder="Write your review here..."></textarea>
      <button @click="submitReview">Submit Review</button>
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
      username: null,  // Add a field for username
      userFavorites: [], // To store favorite products
      averageRating: null,  // To store the average rating
    };
  },
  methods: {
    // Fetch the product details
    calculateAverageRating() {
      if (this.reviews.length > 0) {
        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.averageRating = totalRating / this.reviews.length;
      } else {
        this.averageRating = null; // Set to null if no reviews
      }
    },
    // Fetch the product details
    async fetchProduct() {
      try {
        const response = await axios.get(`http://localhost:3000/products/${this.productId}`);
        this.product = response.data;
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    },
    // Fetch the reviews for the product
    async fetchReviews() {
      try {
        const response = await axios.get(`http://localhost:3000/reviews/${this.productId}`);
        this.reviews = response.data.reviews;
        this.calculateAverageRating(); // Calculate average after fetching reviews
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
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
          this.calculateAverageRating(); // Recalculate average after a new review
          this.newReview.rating = null;
          this.newReview.comment = '';
        } catch (error) {
          console.error('Error submitting review:', error);
        }
      } else {
        alert('Please provide rating, comment, and make sure you are logged in!');
      }
    },
    // Set the rating for the review
    setRating(star) {
      this.newReview.rating = star;
    },
    // Add product to cart (dummy function for now)
    addToCart(product) {
      alert(`Product ${product.name} added to cart!`);
    },
    // Toggle favorite logic
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
    // Check if the product is a favorite
    isFavorite(productId) {
      return this.userFavorites.includes(productId);
    },
    // Fetch user favorites
    async fetchFavorites() {
      const username = this.username;
      try {
        const response = await axios.get(`http://localhost:3000/user/favorites/${username}`);
        this.userFavorites = response.data.favorites;
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    }
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
  }
};
</script>

<style scoped>
.product-details-page {
  font-family: 'Dosis', sans-serif;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.product-header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.product-image {
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
}

.product-info {
  text-align: center;
}

.product-info h2 {
  font-size: 36px;
  margin-bottom: 10px;
}

.product-info h2 span {
  font-size: 20px; 
  color: #f5d826;
  margin-left: 10px; /* Add some space between the name and the rating */
}


.price {
  font-size: 24px;
  color: #6ba823;
  margin-bottom: 10px;
}

.product-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.add-to-cart-btn {
  background-color: #6ba823;
  color: white;
  padding: 10px 20px;
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

.favorite-btn .fas.fa-heart {
  color: red;
}

.favorite-btn .far.fa-heart {
  color: #ccc;
}

.reviews-section {
  margin-top: 40px;
  width: 100%;
}

.review-card {
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.add-review-section {
  margin-top: 40px;
}

.rating {
  display: flex;
  gap: 10px;
}

.rating .star {
  font-size: 24px;
  cursor: pointer;
  color: #f5d826;
}

textarea {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #6ba823;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #f5d826;
}
</style>
