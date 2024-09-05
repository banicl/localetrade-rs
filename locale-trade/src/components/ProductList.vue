<template>
  <div class="products-page">
    <h2>{{ categoryName }}</h2>
    <ul>
      <li v-for="product in products" :key="product._id">
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
      </li>
    </ul>
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
.products-page {
  padding: 20px;
}
h2 {
  margin-bottom: 20px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 10px 0;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}
</style>
