<template>
  <div class="chat-detail-page">
    <div v-if="username" class="chat-section">
      <button @click="goBack" class="back-button">← Back</button>
      <h3>Chat with {{ username }}</h3>
      <div class="chat-log">
        <div v-for="message in chatLog" :key="message._id" class="chat-message">
          <p><b>{{ message.sender }}:</b> {{ message.message }}</p>
        </div>
      </div>
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." class="message-input" />
      <button @click="sendMessage">Send</button>
    </div>
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
    };
  },
  methods: {
    async fetchChat() {
      try {
        const response = await axios.get(`http://localhost:3000/chat/${this.currentUser}/${this.username}`);
        this.chatLog = response.data;
      } catch (error) {
        console.error('Error fetching chat:', error);
      }
    },
    async sendMessage() {
      if (this.newMessage.trim() !== '') {
        try {
          const response = await axios.post('http://localhost:3000/chat', {
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
      this.$router.go(-1); // Navigate back to the chat list
    },
  },
  created() {
    this.currentUser = JSON.parse(localStorage.getItem('user')).username;
    this.fetchChat();
  },
};
</script>

<style scoped>


.chat-detail-page {
  padding: 20px;
}
.chat-log {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
}
.chat-message {
  padding: 10px;
  border-bottom: 1px solid #eaeaea;
}
.message-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
}
.back-button {
  background-color: #f5f5f5;
  border: none;
  cursor: pointer;
  font-size: 20px;
  margin-bottom: 20px;
}
</style>
