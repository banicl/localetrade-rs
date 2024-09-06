<template>
  <div class="addlisting-page">
    <div class="background-image"></div>
    <div class="overlay"></div>

    <nav class="navbar">
      <div class="nav-social">
        <a href="https://www.facebook.com" target="_blank"><i class="fab fa-facebook-f"></i></a>
        <a href="https://www.instagram.com" target="_blank"><i class="fab fa-instagram"></i></a>
        <a href="https://www.tiktok.com" target="_blank"><i class="fab fa-tiktok"></i></a>
      </div>
      <ul class="nav-menu">
        <li><router-link to="/profile">PROFILE 🍅</router-link></li>
        <li><router-link to="/newspage">HOME 🏡</router-link></li>
        <li><a href="#" @click="logout">LOGOUT 🥕</a></li>
      </ul>
    </nav>

    <div class="content">
      <h1 style="color:#6ba823; font-size:40px">LIST A NEW PRODUCT</h1>
      <div class="listing-container">
        <form @submit.prevent="submitProduct">
          <div class="form-group">
            <label for="name"><b>Product Name:</b></label>
            <input type="text" id="name" v-model="name" required>
          </div>
          <div class="form-group">
            <label for="price"><b>Product Price in Euros:</b></label>
            <input type="number" id="price" v-model="price" required>
          </div>
          <div class="form-group">
            <label for="location"><b>Short Product Description:</b></label>
            <input type="text" id="location" v-model="location" required>
          </div>
          <div class="form-group">
            <label for="category"><b>Choose Category:</b></label>
            <select v-model="category">
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.emoji }} {{ cat.name }}
                </option>
            </select>
          </div>
          <div class="form-group">
            <label for="file-input" class="custom-file-label">Choose File</label>
            <input type="file" id="file-input" @change="handleFileUpload" style="display: none;">
            <p v-if="imageName" style="color:white">Odabrana slika: {{ imageName }}</p> <!-- Display the file name -->
          </div>
          <button type="submit">Add Product</button>
        </form>
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
  data() {
    return {
      currentUser: JSON.parse(localStorage.getItem('currentUser')),
      name: '',
      price: '',
      location: '',
      category: '',
      image: null,
      imageName: '',
      currentDate: new Date().toLocaleDateString(),
      categories: [
        { id: 1, name: 'Fresh Produce 🍎' },
        { id: 2, name: 'Dairy Products 🧀' },
        { id: 3, name: 'Meat and Poultry 🍖' },
        { id: 4, name: 'Baked Goods 🍞' },
        { id: 5, name: 'Seafood 🐟' },
        { id: 6, name: 'Beverages ☕' },
        { id: 7, name: 'Pantry Staples 🍯' },
        { id: 8, name: 'Snacks and Confectionery 🍫' },
        { id: 9, name: 'Personal Care 🧼' },
        { id: 10, name: 'Household Items 🏠' }
      ]
    };
  },
  methods: {
    handleFileUpload(event) {
        this.image = event.target.files[0];
        this.imageName = event.target.files[0].name;
    },
    logout() {
      localStorage.removeItem('user');
      this.$router.push('/login');
    },
    async submitProduct() {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (!currentUser) {
            alert('User is not logged in');
            return;
        }
    
        const formData = new FormData();
        formData.append('name', this.name);
        formData.append('price', this.price);
        formData.append('location', this.location);
        formData.append('category', this.category);
        formData.append('image', this.image);
        formData.append('username', currentUser.username); 

        try {
            await axios.post('http://localhost:3000/addlisting', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Product added successfully!');
            this.$router.push({ name: 'ProductList', params: { categoryId: this.category } });
        } catch (error) {
            console.error('Error adding product:', error);
        }
    },
    },
    mounted() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        this.currentUser = JSON.parse(user);
    }
    }};
</script>

<style scoped>
body {
  margin: 0;
  font-family: 'Dosis', sans-serif;
}

.background-image,
.addlisting-page {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100vh;
}

.addlisting-page {
  overflow: hidden;
}

.background-image {
  background: url('@/assets/background-2.jpeg') no-repeat center center;
  background-size: cover;
  filter: blur(4px);
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

.navbar {
  position: relative; 
  z-index: 2;
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

.content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100% - 150px);
  text-align: left;
  z-index: 1;
  font-family: 'Dosis', sans-serif;
}

.listing-container {
  background: rgba(204, 204, 204, 0.3);
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  width: 40%;
  color: rgba(0, 0, 0, 0.8);
}

input, select {
  padding: 10px;
  margin-bottom: 10px;
  width: 95%;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  background-color: #6ba823;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #f5d826;
}

.custom-file-label {
  background-color: #f5d826;
  color: white;
  border: none;
  padding: 5px;
  margin-bottom:10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: inline-block;
  text-align: center;
}

.custom-file-label:hover {
  background-color: rgba(0, 0, 0, 0.8);
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
