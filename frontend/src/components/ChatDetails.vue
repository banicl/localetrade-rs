<template>
  <div class="chat-detail-page">
    <div v-if="username" class="chat-section">
      <button @click="goBack" class="back-button">
        <i class="fas fa-arrow-left"></i> 
      </button>
      <h1 class="chat-title">Chat with {{ username }} 💬</h1>

      <div class="chat-log">
        <div v-for="message in chatLog" :key="message._id" class="chat-message">
          <p><b>{{ message.sender }}:</b> {{ message.message }}</p>
        </div>
      </div>

      <div class="message-input-section">
        <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." class="message-input" />
        <button @click="sendMessage" class="send-button">Send</button>
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
  props: ['username'],
  data() {
    return {
      chatLog: [],
      newMessage: '',
      currentDate: '',
    };
  },
  methods: {
    async fetchChat() {
      try {
        const response = await axios.get(`http://localhost:3004/chat/${this.currentUser}/${this.username}`);
        this.chatLog = response.data;
      } catch (error) {
        console.error('Error fetching chat:', error);
      }
    },
    async sendMessage() {
      if (this.newMessage.trim() !== '') {
        try {
          const response = await axios.post('http://localhost:3004/chat', {
            sender: this.currentUser,
            receiver: this.username,
            message: this.newMessage,
          });
          this.chatLog.push(response.data);
          this.newMessage = '';
        } catch (error) {
          console.error('Error sending message:', error);
        }
      }
    },
    goBack() {
      this.$router.go(-1); 
    },
    formatDateTime(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(date).toLocaleString(undefined, options);
    },
    updateDate() {
      this.currentDate = new Date().toLocaleDateString();
    },
  },
  created() {
    this.currentUser = JSON.parse(localStorage.getItem('user')).username;
    this.fetchChat();
  },
  mounted() {
    this.updateDate();
    setInterval(this.updateDate, 86400000); 
  },
};
</script>

<style scoped>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Dosis', sans-serif;
  margin:0px;
  padding:0px;
}

.chat-detail-page {
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

.chat-section {
  margin-top: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.back-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: #6ba823;
  transition: color 0.3s ease;
  position: absolute;
  top: 40px;
  left: 40px;
}

.back-button:hover {
  color: #f5d826;
}

.back-button i {
  font-size: 30px;
}

/* Chat title */
.chat-title {
  font-size: 36px;
  color: white;
  margin-bottom: 30px;
  text-align: center;
}

.chat-log {
  max-height: 400px;
  width: 100%;
  overflow-y: auto;
  margin-bottom: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.chat-message {
  padding: 10px;
  border-bottom: 1px solid #eaeaea;
  word-wrap: break-word;
}

.message-input-section {
  display: flex;
  width: 100%;
  max-width: 800px;
  gap: 10px;
}

.message-input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
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
