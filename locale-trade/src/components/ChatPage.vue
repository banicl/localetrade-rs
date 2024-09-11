<template>
  <div class="chat-page">
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
    <div class="padding-section">
    <div v-if="selectedUser" class="chat-header">
      <button @click="goBack" class="back-button">← Back</button>
      <h3>Chat with {{ selectedUser.username }}</h3>
    </div>

    <div v-if="selectedUser" class="chat-section">
      <div class="chat-log">
        <div v-for="message in chatLog" :key="message._id" class="chat-message">
          <p><b>{{ message.sender }}:</b> {{ message.message }}</p>
        </div>
      </div>
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." class="message-input" />
      <button @click="sendMessage" class="send-button">Send</button>
    </div>

    <div v-else>
      <h1 class="section-title">👩🏻‍🌾 LAST CONVERSATIONS</h1>
      <div v-if="lastConversations.length > 0" class="last-conversations">
        <div v-for="conversation in lastConversations" :key="conversation.otherUser" class="conversation-card" @click="openChatFromConversation(conversation.otherUser)">
          <h3 :class="{ unread: conversation.unread }">{{ conversation.otherUser }}</h3>
          <p>{{ conversation.lastMessage }}</p>
          <span>{{ formatDateTime(conversation.lastDate) }}</span>
        </div>
      </div>

      <div v-else class="no-conversations">
        <p>You don't have any previous conversations. Start one now!</p>
      </div>

      <h1 class="section-title">USERS 🪶</h1>
      <div class="search-bar">
        <div class="search-container">
            <i class="fas fa-search search-icon"></i> 
            <input
            type="text"
            placeholder="Search users..."
            v-model="searchQuery"
            />
        </div>
      </div>
      <div class="user-list">
        <div v-for="user in filteredUsers" :key="user.username" class="user-card" @click="openChat(user)">
          <img :src="user.profilePicture ? `http://localhost:3000${user.profilePicture}` : 'http://localhost:3000/uploads/default-pic.avif'" alt="Profile Picture" class="profile-pic">
          <div class="user-info">
            <h3>{{ user.username }}</h3>
            <p>Products Listed: {{ user.productsListed }}</p>
            <p style="color:#6EA823;">Avg. Rating: {{ user.avgRating }}</p>
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

export default {
  data() {
    return {
      lastConversations: [],
      users: [],
      searchQuery: '',
      selectedUser: null,
      chatLog: [],
      newMessage: '',
      currentDate: '',
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user =>
        user.username.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    async fetchLastConversations() {
      try {
        const response = await axios.get(`http://localhost:3000/last-conversations/${this.currentUser}`);
        this.lastConversations = response.data;
      } catch (error) {
        console.error('Error fetching last conversations:', error);
      }
    },
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:3000/users-with-products');
        this.users = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    async openChat(user) {
      this.$router.push({ name: 'ChatDetails', params: { username: user.username } });
    },
    async openChatFromConversation(username) {
      this.$router.push({ name: 'ChatDetails', params: { username } });
    },
    goBack() {
      this.selectedUser = null;
    },
    formatDateTime(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(date).toLocaleString(undefined, options);
    },
    updateDate() {
      this.currentDate = new Date().toLocaleDateString();
    },
    logout() {
      localStorage.removeItem('user');
      this.$router.push('/login');
    }
  },
  created() {
    this.currentUser = JSON.parse(localStorage.getItem('user')).username;
    this.fetchLastConversations();
    this.fetchUsers();
  },
  mounted() {
    this.updateDate();
    setInterval(this.updateDate, 86400000); 
  },

};
</script>

<style scoped>

body {
  margin: 0;
  font-family: 'Dosis', sans-serif;
}

.padding-section {
  padding: 0px 40px;
}

.chat-page {
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
  background: url('@/assets/products-background.png') no-repeat center center;
  background-size: cover;
  background-attachment: fixed;
}

.separator {
  border-left: 2px solid white;
  height: 30px;
  margin-left: 40px;
  margin-right: 10px;
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

.search-bar {
  display: flex;
  justify-content: flex-end;
  margin-right: 20px;
  margin-top: 10px;
  margin-bottom: 30px;
}

.search-container {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 5px 15px;
  background-color: white;
  width: 300px;
}

.search-icon {
  color: #999;
  margin-right: 10px;
}

.search-bar input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 16px;
  background: none;
}

.search-bar input::placeholder {
  color: #bbb;
}

.section-title {
  font-family: 'Dosis', sans-serif;
  color: white;
  text-align: center;
  margin-bottom: 20px;
}

.last-conversations, .user-list {
  margin-bottom: 20px;
}

.conversation-card {
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.conversation-card:hover {
  transform: translateY(-5px);
}

.conversation-card h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.conversation-card h3.unread {
  color: red;
}

.no-conversations {
  font-size: 18px;
  color: #888;
  text-align: center;
  margin-bottom: 20px;
}

.user-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.user-card {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: transform 0.3s ease;
}

.user-card:hover {
  transform: translateY(-5px);
}

.profile-pic {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex-grow: 1;
}

.chat-section {
  margin-top: 20px;
}

.chat-log {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.chat-message {
  padding: 10px;
  border-bottom: 1px solid #eaeaea;
}

.message-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
}

.send-button {
  background-color: #6ba823;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.send-button:hover {
  background-color: #f5d826;
}

.back-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 20px;
  margin-bottom: 20px;
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
