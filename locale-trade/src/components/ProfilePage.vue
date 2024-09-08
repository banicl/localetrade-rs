<template>
  <div class="profile-page">
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
    <h1 style="color:#6ba823; font-size:40px">USER PROFILE</h1>
      <div class="profile-container">
        <img :src="userProfilePicture" alt="Profile Picture" class="profile-picture">
        <button @click="triggerFileInput" class="edit-picture-btn"><i class="fas fa-edit"></i></button>
        <input type="file" ref="fileInput" @change="uploadProfilePicture" style="display: none;">
        <h2 style="color:white ">{{ user.username }}  </h2>
        <div class="profile-buttons">
          <button @click="goToListedItems">LISTED ITEMS 💛</button>
          <button @click="goToBoughtItems">BOUGHT ITEMS 🧡</button>
          <button @click="goToFavoritedItems">FAVORITED ITEMS ❤️</button>
        </div>
        <div v-if="notificationMessage" class="notification">
          {{ notificationMessage }}
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
  name: 'ProfilePage',
  data() {
    return {
      user: null,
      userProfilePicture: require('@/assets/default-pic.avif'),
      notificationMessage: '', 
      currentDate: ''
    };
  },
  methods: {
    updateDate() {
      this.currentDate = new Date().toLocaleDateString();
    },
    logout() {
      localStorage.removeItem('user');
      console.log('Logout successful');
      this.$router.push('/login');
    },
    goToListedItems() {
      this.$router.push('/listed-items'); 
    },
    goToBoughtItems() {
      this.$router.push('/bought-items'); 
    },
    goToFavoritedItems() {
      this.$router.push('/favorited-items'); 
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async uploadProfilePicture(event) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('profilePicture', file);
    formData.append('username', this.user.username); // Send username with the request

    try {
        const response = await axios.post('http://localhost:3000/upload-profile-picture', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
        });
        this.userProfilePicture = response.data.profilePictureUrl;
        console.log('Profile picture updated successfully', response);

        this.user.profilePicture = response.data.profilePictureUrl;
        localStorage.setItem('user', JSON.stringify(this.user));
        
        this.notificationMessage = 'Profile picture updated successfully!';
        
        setTimeout(() => {
        this.notificationMessage = '';
        }, 3000);
    } catch (error) {
        console.error('Error uploading profile picture', error);
    }
    }
  },
  created() {
    const userData = localStorage.getItem('user');
    if (userData && userData !== 'undefined') {
      try {
        this.user = JSON.parse(userData);
        this.userProfilePicture = this.user.profilePicture || require('@/assets/default-pic.avif');
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    } else {
      console.warn('No user data found in localStorage.');
      this.$router.push('/login');
    }
  },
  mounted() {
    this.updateDate();
    setInterval(this.updateDate, 86400000);
  }
};

</script>

<style scoped>
body {
  margin: 0;
  font-family: 'Dosis', sans-serif;
}

.title-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 30px;
  background-color: transparent;
  display: block;
}

.background-image,
.profile-page {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100vh;
}

.profile-page {
  overflow: hidden;
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
  background: url('@/assets/background-2.jpeg') no-repeat center center;
  background-size: cover;
  filter: blur(4px);
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
  text-align: center;
  z-index: 1;
  font-family: 'Dosis', sans-serif;
}

.title-image {
  max-width: 15%;
  height: auto;
  margin-bottom: 30px;
  background-color: transparent;
  display: block;
}

.profile-container {
  background: rgba(204, 204, 204, 0.3);
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
}

.profile-picture {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 20px;
}

.edit-picture-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.profile-buttons button {
  background-color: #6ba823;
  color: white;
  border: none;
  padding: 10px 10px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-family: 'Dosis', sans-serif;
  font-weight: bold;
}

.profile-buttons button:hover {
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

.notification {
  padding: 10px;
  border-radius: 5px;
  color: #6ba823;
  font-weight: bold;
  text-align: center;
}
</style>
