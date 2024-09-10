<template>
  <div class="chat-page">
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
      <button @click="sendMessage">Send</button>
    </div>

    <div v-else>
      <h2>Last Conversations</h2>
      <div class="last-conversations">
        <div v-for="conversation in lastConversations" :key="conversation.otherUser" class="conversation-card" @click="openChatFromConversation(conversation.otherUser)">
          <h3 :class="{ unread: conversation.unread }">{{ conversation.otherUser }}</h3>
          <p>{{ conversation.lastMessage }}</p>
          <span>{{ formatDateTime(conversation.lastDate) }}</span>
        </div>
      </div>

      <h2>Users</h2>
      <input v-model="searchQuery" placeholder="Search users..." class="search-bar" />
      <div class="user-list">
        <div v-for="user in filteredUsers" :key="user.username" class="user-card" @click="openChat(user)">
          <img :src="user.profilePicture ? `http://localhost:3000${user.profilePicture}` : 'http://localhost:3000/uploads/default-pic.avif'" alt="Profile Picture" class="profile-pic">
          <div class="user-info">
            <h3>{{ user.username }}</h3>
            <p>Products Listed: {{ user.productsListed }}</p>
            <p>Avg. Rating: {{ user.avgRating }}</p>
          </div>
        </div>
      </div>
    </div>
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
      this.$router.push({ name: 'ChatDetails', params: { username: user.username } }); // Navigate to ChatDetails
    },
    async openChatFromConversation(username) {
      this.$router.push({ name: 'ChatDetails', params: { username } }); // Open from conversation
    },
    goBack() {
      this.selectedUser = null;
    },
    formatDateTime(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(date).toLocaleString(undefined, options);
    },
  },
  created() {
    this.currentUser = JSON.parse(localStorage.getItem('user')).username;
    this.fetchLastConversations();
    this.fetchUsers();
  },
};
</script>


<style scoped>
.chat-page {
  padding: 20px;
}
.last-conversations, .user-list {
  margin-bottom: 20px;
}
.conversation-card {
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  cursor: pointer;
}
.conversation-card h3 {
  margin: 0;
}
.conversation-card h3.unread {
  color: red;
}
.user-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.user-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
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
  margin-top: 40px;
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
