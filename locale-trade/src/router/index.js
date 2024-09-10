import { createRouter, createWebHistory } from 'vue-router';
import WelcomePage from '../components/WelcomePage.vue';
import LoginPage from '../components/LoginPage.vue';
import RegisterPage from '../components/RegisterPage.vue'; 
import MenuPage from '../components/MenuPage.vue'; 
import ProductList from '../components/ProductList.vue';
import NewsPage from '../components/NewsPage.vue'; 
import ProfilePage from '../components/ProfilePage.vue';
import AddListing from '../components/AddListing.vue';
import FavoritedItems from '../components/FavoritedItems.vue';
import ListedItems from '../components/ListedItems.vue';
import ChatPage from '../components/ChatPage.vue';

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
  {
    path: '/favorited-items',
    name: 'FavoritedItems',
    component: FavoritedItems,
  },  
  {
    path: '/listed-items',
    name: 'ListedItems',
    component: ListedItems,
  },  
  {
    path: '/product/:productId',
    name: 'ProductDetails',
    component: () => import('@/components/ProductDetails.vue'),
    props: true,
  },  
  {
    path: '/chat-page',
    name: 'ChatPage',
    component: ChatPage,
  },  
  {
    path: '/chat-details/:username',
    name: 'ChatDetails',
    component: () => import('../components/ChatDetails.vue'), // Lazy load the component
    props: true // Ensure the username is passed as a prop
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
