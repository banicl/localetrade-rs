import { createRouter, createWebHistory } from 'vue-router';
import WelcomePage from '../components/WelcomePage.vue';

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: WelcomePage
  },
  // ... other routes ...
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
