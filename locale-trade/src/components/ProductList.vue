<template>
  <div class="products-page">
    <h2>Proizvodi u kategoriji {{ categoryName }}</h2>
    <ul>
      <li v-for="product in filteredProducts" :key="product.id">
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ProductList',
  props: ['categoryId'],
  data() {
    return {
      categories: [
        { id: 1, name: 'Kategorija 1' },
        { id: 2, name: 'Kategorija 2' }
      ],
      products: [
        { id: 1, name: 'Proizvod 1', description: 'Opis proizvoda 1', categoryId: 1 },
        { id: 2, name: 'Proizvod 2', description: 'Opis proizvoda 2', categoryId: 1 },
        { id: 3, name: 'Proizvod 3', description: 'Opis proizvoda 3', categoryId: 2 }
      ]
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter(product => product.categoryId == this.categoryId);
    },
    categoryName() {
      const category = this.categories.find(category => category.id == this.categoryId);
      return category ? category.name : 'Nepoznata kategorija';
    }
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
