<template>
  <div class="welcome-container">
    <div class="background-image"></div>
    <div class="overlay"></div>
    <nav class="navbar">
      <div class="nav-social">
        <a href="https://www.facebook.com" target="_blank"><i class="fab fa-facebook-f"></i></a>
        <a href="https://www.instagram.com" target="_blank"><i class="fab fa-instagram"></i></a>
        <a href="https://www.tiktok.com" target="_blank"><i class="fab fa-tiktok"></i></a>
      </div>
      <ul class="nav-menu">
        <li><a href="#" @click="goToHome">HOME 🏡</a></li>
        <li><a href="#" @click="goToLogin">LOGIN 🍏</a></li>
      </ul>
    </nav>

    <div class="content">
      <form class="login-form">
        <img src="@/assets/register.svg" alt="Register" class="title-image" />
        <div class="input-row">
          <input type="text" placeholder="Username 🌽" v-model="username" required>
          <input type="text" placeholder="Email 🥕" v-model="email" required>
        </div>
        <div class="input-row">
          <input type="password" placeholder="Password 🌾" v-model="password" required>
          <input type="password" placeholder="Confirm Password 🥬" v-model="confirmPassword" required>
        </div>
        <p v-if="password && confirmPassword && !isPasswordValid" class="password-warning">
          Passwords do not match.
        </p>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <button type="button" @click="submitRegister" :disabled="!isPasswordValid"><b>✨ SIGN UP ✨</b></button>
        <p class="register-link">Already have an account? 👨🏻‍🌾 Log in.<br><a href="#" @click="goToLogin">Log in here!</a></p>
      </form>
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
  name: 'RegisterPage',
  data() {
    return {
      currentDate: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: '', 
    };
  },
  computed: {
    isPasswordValid() {
      return this.password && this.password === this.confirmPassword;
    }
  },
  methods: {
    goToLogin() {
      this.$router.push({ name: 'Login' }); 
    },
    goToHome() {
      this.$router.push({ name: 'Welcome' }); 
    },
    updateDate() {
      this.currentDate = new Date().toLocaleDateString();
    },
    async submitRegister() {
      this.errorMessage = ''; 
      if (this.isPasswordValid) {
        try {
          const response = await axios.post('http://localhost:3001/register', {
            username: this.username,
            email: this.email,
            password: this.password
          });
          console.log('Registration successful', response);
          this.$router.push('/login');
        } catch (error) {
          if (error.response && error.response.data.includes('username')) {
            this.errorMessage = 'Username is already taken.';
          } else if (error.response && error.response.data.includes('email')) {
            this.errorMessage = 'Email is already taken.';
          } else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
          console.error('Registration failed', error);
        }
      }
    }
  },
  mounted() {
    this.updateDate();
    setInterval(this.updateDate, 86400000); 
  }
}
</script>

<style scoped>
body {
  margin: 0;
  font-family: 'Dosis', sans-serif;
}

.title-image {
  max-width: 85%;
  height: auto;
  margin-bottom: 30px;
  background-color: transparent;
  display: block;
}

.welcome-container,
.background-image {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100vh;
}

.welcome-container {
  overflow: hidden;
  padding: none;
  margin: none;
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
  background: url('@/assets/background.webp') no-repeat center center;
  background-size: cover;
  filter: blur(4px);
}

.content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  z-index: 1;
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

.login-form {
  font-family: 'Dosis', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background: rgba(204, 204, 204, 0.3);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 200px;
  width: 250px;
  margin-top: 60px;
}

.login-form input {
  width: 80%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.register-link {
  margin-top: 15px;
  color: #ccc;
}

.register-link a {
  color: #6ba823;
}

.login-form button {
  width: 85%;
  padding: 10px;
  border: none;
  background-color: #6ba823;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-form button:hover {
  background-color: #f5d826;
}

.password-warning,
.error-message {
  color: red;
  font-size: 14px;
  margin-top: -15px;
}
</style>
