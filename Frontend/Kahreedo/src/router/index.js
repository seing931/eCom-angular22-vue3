import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/components/Layout.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Account from '@/views/Account.vue'
import Product from '@/views/Prod.vue'
import ProductViewDet from '@/views/ProdViewDet.vue'
import Cart from '@/views/MyCart.vue'
import Wishlist from '@/views/Wishlist.vue'
import Checkout from '@/views/Checkout.vue'
import Thankyou from '@/views/Thankyou.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
      {
        path: '',
        name: 'Home',
        component: Home
      },
      {
        path: 'Login',
        name: 'Login',
        component: Login
      },
      {
        path: 'Account',
        name: 'Account',
        component: Account
      },
      {
        path: 'Prod', 
        name: 'Product',
        component: Product
      },
      {
        path: 'ProdViewDet/:id', 
        name: 'ProductViewDet',
        component: ProductViewDet
      },
      {
        path: 'MyCart',
        name: 'MyCart',
        component: Cart
      },
      {
        path: 'WishList',
        name: 'WishList',
        component: Wishlist
      },
      {
        path: 'Checkout',
        name: 'Checkout',
        component: Checkout
      },
      {
        path: 'Thankyou',
        name: 'Thankyou',
        component: Thankyou
      }
    ]
    },
  ],
})

export default router
