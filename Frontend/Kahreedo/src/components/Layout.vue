<template>
  <div id="app-container">
    <div id="wpf-loader-two" v-if="loading">
      <div class="wpf-loader-two-inner"><span>Loading</span></div>
    </div>
    
    <header id="aa-header">
       <div class="aa-header-top">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <div class="aa-header-top-area">
                            <!-- start header top left -->
                            <div class="aa-header-top-left">
                                <!-- start language -->
                                <div class="aa-language">
                                    <div class="dropdown">
                                        <router-link class="btn dropdown-toggle" to="/" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                            <img src="/img/flag/english.jpg" alt="english flag">ENGLISH
                                        </router-link>
                                    </div>
                                </div>
                                <!-- / language -->
                                <!-- start currency -->
                                <div class="aa-currency">
                                    <div class="dropdown">
                                        <router-link class="btn dropdown-toggle" to="/" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                            <i class="fa fa-money"></i>PKR
                                        </router-link>                                        
                                    </div>
                                </div>
                                <!-- / currency -->
                                <!-- cellphone -->
                                <div class="cellphone hidden-xs">
                                    <p><span class="fa fa-phone"></span>021-6558-6588</p>
                                </div>
                                <!-- / username -->
                                <div v-if="isAuthenticated" class="cellphone hidden-xs">
                                    <p><span class="fa fa-user"></span>Welcome {{ userName }}</p>
                                </div>
                            </div>
                            <!-- / header top left -->
                            <div class="aa-header-top-right">
                                <ul class="aa-head-top-nav-right"> 
                                    <li>
                                        <router-link :to="isAuthenticated ? '/Account' : '/Login'">My Account</router-link>
                                    </li>   
                                   <li class="hidden-xs">
                                    <router-link :to="isAuthenticated ? '/Wishlist' : '/Login'">Wishlist 
                                       <span v-if="isAuthenticated && wishlistStore.wishlistCount > 0">({{ wishlistStore.wishlistCount }})</span>
                                    </router-link>
                                    </li>

                                    <li class="hidden-xs">
                                    <router-link :to="isAuthenticated ? '/MyCart' : '/Login'"> My Cart
                                       <span v-if="isAuthenticated && myCartCount > 0">({{ myCartCount }})</span>
                                    </router-link>
                                    </li>
                                    <li class="hidden-xs">
                                        <router-link :to="isAuthenticated ? '/Checkout' : '/Login'">Checkout</router-link>
                                    </li>
                                    <li>
                                        <button class="nav-link-btn" @click="handleAuth">{{ authButtonText }}</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
       </div>

    <div class="aa-header-bottom">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="aa-header-bottom-area">
                    <!-- logo  -->
                    <div class="aa-logo">
                        <!-- Text based logo -->
                        <router-link to="/">
                            <span class="fa fa-shopping-cart"></span>
                            <p>Khareedo<strong>.pk</strong> <span>Your Shopping Partner</span></p>
                        </router-link>
                    </div>
                    <!-- / logo  -->
                    <!-- cart box -->
                    <div class="aa-cartbox">
                        <router-link to="/" class="aa-cart-link" >
                            <span class="fa fa-shopping-basket"></span>
                            <span class="aa-cart-title">SHOPPING CART</span>
                            <span class="aa-cart-notify"></span>
                        </router-link>
                        <div class="aa-cartbox-summary">
                            <ul>
                               
                            </ul>
                             <router-link to="/" class="aa-cartbox-checkout aa-primary-btn"> Checkout</router-link>
                        </div>
                    </div>
                    <!-- / cart box -->
                     <SearchBox /> <!-- search box -->
                </div>
            </div>
        </div>
    </div>
</div>
    </header>

        <section id="menu">
        <div class="container">
            <div class="menu-area">
                <div class="navbar navbar-default" role="navigation">
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                    </div>
                    <div class="navbar-collapse collapse">
                         <Navbar />
                    </div>
                </div>
            </div>
        </div>
    </section>


    <main>
        <RouterView />
    </main>

    <section id="aa-subscribe">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="aa-subscribe-area">
                    <h3>Subscribe our newsletter </h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex, velit!</p>
                    <form action="" class="aa-subscribe-form">
                        <input type="email" name="" id="" placeholder="Enter your Email">
                        <input type="submit" value="Subscribe">
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>

<footer id="aa-footer">
    <!-- footer bottom -->
    <div class="aa-footer-top">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="aa-footer-top-area">
                        <div class="row">
                            <div class="col-md-3 col-sm-6">
                                <div class="aa-footer-widget">
                                    <h3>Main Menu</h3>
                                    <ul class="aa-footer-nav" style="padding-left: 0;">
                                        <li><router-link to="/">Home</router-link></li>
                                        <li><router-link to="/">Our Services</router-link></li>
                                        <li><router-link to="/">Our Products</router-link></li>
                                        <li><router-link to="/">About Us</router-link></li>
                                        <li><router-link to="/">Contact Us</router-link></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-6">
                                <div class="aa-footer-widget">
                                    <div class="aa-footer-widget">
                                        <h3>Knowledge Base</h3>
                                        <ul class="aa-footer-nav" style="padding-left: 0;">
                                            <li><router-link to="/">Delivery</router-link></li>
                                            <li><router-link to="/">Returns</router-link></li>
                                            <li><router-link to="/">Services</router-link></li>
                                            <li><router-link to="/">Discount</router-link></li>
                                            <li><router-link to="/">Special Offer</router-link></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-6">
                                <div class="aa-footer-widget">
                                    <div class="aa-footer-widget">
                                        <h3>Useful Links</h3>
                                        <ul class="aa-footer-nav" style="padding-left: 0;">
                                            <li><router-link to="/">Site Map</router-link></li>
                                            <li><router-link to="/">Search</router-link></li>
                                            <li><router-link to="/">Advanced Search</router-link></li>
                                            <li><router-link to="/">Suppliers</router-link></li>
                                            <li><router-link to="/">FAQ</router-link></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-6">
                                <div class="aa-footer-widget">
                                    <div class="aa-footer-widget">
                                        <h3>Contact Us</h3>
                                        <address>
                                            <p>Suit#007, Sharae Faisal ,Karachi</p>
                                            <p><span class="fa fa-phone"></span>021-6558-6588</p>
                                            <p><span class="fa fa-envelope"></span>help@Khareedo.com.pk</p>
                                        </address>
                                        <div class="aa-footer-social">
                                            <router-link to="/"><span class="fa fa-facebook"></span></router-link>
                                            <router-link to="/"><span class="fa fa-twitter"></span></router-link>
                                            <router-link to="/"><span class="fa fa-google-plus"></span></router-link>
                                            <router-link to="/"><span class="fa fa-youtube"></span></router-link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- footer-bottom -->
    <div class="aa-footer-bottom">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="aa-footer-bottom-area">
                        <p>Developed with Vue 3 by <router-link to="/">Suey Seing</router-link></p>
                        <div class="aa-footer-payment">
                            <span class="fa fa-cc-mastercard"></span>
                            <span class="fa fa-cc-visa"></span>
                            <span class="fa fa-paypal"></span>
                            <span class="fa fa-cc-discover"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</footer>
</div>
</template>

<script setup>
import { ref, computed, onMounted,watch } from 'vue'; 
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import Navbar from '@/components/Navbar.vue';
import SearchBox from '@/components/Searchbox.vue';
import api from '@/api';
import { userName, isAuthenticated, customerId, logoutUser } from '@/stores/authStore.js';
import { useWishlistStore } from '@/stores/wishlist.js';
import { useMyCartStore } from '@/stores/myCart.js';

const router = useRouter();
const cartStore = useMyCartStore();
const { myCartCount } = storeToRefs(cartStore);
const wishlistStore = useWishlistStore();
const loading = ref(false);
const authButtonText = computed(() => isAuthenticated.value ? 'Logout' : 'Login')

 watch([customerId, isAuthenticated], ([newId, newAuth]) => {
  if (newAuth) {
    wishlistStore.fetchCount(newId, newAuth);
    cartStore.fetchBackendCart();
  } else {
    cartStore.clearCart();
  }
}); 

const handleAuth = () => {
  if (isAuthenticated.value) {
    logoutUser();
    router.push('/'); 
  } else {
    router.push('/Login');
  }
};

onMounted(() => {
  wishlistStore.fetchCount(customerId.value, isAuthenticated.value);
  if (isAuthenticated.value) {
    cartStore.fetchBackendCart();
  }
});
</script>