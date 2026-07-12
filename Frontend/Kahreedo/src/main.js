import './assets/css/style.css'; // Import global styles
import './assets/css/bootstrap.css'; 
import './assets/css/theme-color/green-theme.css';
import './assets/css/font-awesome.css'; 
import './assets/css/sequence-theme.modern-slide-in.css';
import './assets/css/slick.css';
import './assets/css/swiper-common.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
app.use(pinia)

app.use(router)
app.mount('#app')
