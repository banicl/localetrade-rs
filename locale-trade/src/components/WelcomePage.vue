<template>
  <div class="welcome-container">
    <div class="background-image"></div>
    <div class="overlay"></div>

    <nav class="navbar">
      <ul class="nav-menu">
        <li><a href="#" @click="goToLogin">LOGIN 🍏</a></li>
        <li><a href="#" @click="goToRegister">REGISTER 🍎</a></li>
      </ul>
    </nav>
    <div class="content">
      <img src="@/assets/logo.png" alt="Logo" class="logo-image" />
      <img src="@/assets/title.svg" alt="Title" class="title-image" />
    </div>
    <footer class="footer">
      <p><b>&copy; 2024 🌿 LOCALE TRADE. All rights reserved.</b></p>
      <div id="current-date"><span class="date-color"><b>{{ currentDate }}</b></span></div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'WelcomePage',
  data() {
    return {
      currentDate: '',
    };
  },
  methods: {
    goToLogin() {
      
    },
    goToRegister() {
      
    },
    updateDate() {
      this.currentDate = new Date().toLocaleDateString();
    }
  },
  mounted() {
    this.updateDate();
    setInterval(this.updateDate, 86400000); // Update date every day
  }
}

</script>

<style scoped>

  body {
  margin: 0;
  font-family: 'Dosis', sans-serif;
  }

  .welcome-container, .background-image {
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
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('@/assets/background.webp') no-repeat center center;
    background-size: 100%;
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

  .title-image {
    max-width: 80%;
    height: auto;
    margin-bottom: 300px;
    background-color: transparent; 
    display: block;
  }

  .logo-image {
    max-width: 20%; 
    z-index: 1;
    height: auto;
    padding: none;
    margin:none;
  }

  .navbar {
    position: relative; 
    z-index: 2;
    width: 100%;
    background-color: rgba(204, 204, 204, 0.3);
    box-shadow: 0 2px 4px #454545;
    padding: 10px 0;
    margin: none;
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
