import { createRouter, createWebHistory } from 'vue-router';
import WelcomePage from '../components/WelcomePage.vue';
import LoginPage from '../components/LoginPage.vue';
import RegisterPage from '../components/RegisterPage.vue'; 
import MenuPage from '../components/MenuPage.vue'; 
import ProductList from '../components/ProductList.vue';
import NewsPage from '../components/NewsPage.vue'; 
import ProfilePage from '../components/ProfilePage.vue';
import AddListing from '../components/AddListing.vue';

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: WelcomePage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage 
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage 
  },
  {
    path: '/menu',
    name: 'MenuPage',
    component: MenuPage 
  },
  {
    path: '/category/:categoryId',
    name: 'ProductList',
    component: ProductList,
    props: true
  },
  {
    path: '/newspage',
    name: 'NewsPage',
    component: NewsPage, 
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
  },
  {
    path: '/addlisting',
    name: 'AddListing',
    component: AddListing,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
