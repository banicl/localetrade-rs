import { createRouter, createWebHistory } from 'vue-router';
import WelcomePage from '../components/WelcomePage.vue';
import LoginPage from '../components/LoginPage.vue';      // Import LoginPage
import RegisterPage from '../components/RegisterPage.vue'; // Import RegisterPage

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: WelcomePage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage // Add this route
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage // Add this route
  },
  // ... other routes ...
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
