<script setup>
import { ref, onMounted } from 'vue';
import { isAuthenticated, customerId } from '@/stores/authStore.js';
import api from '@/api';
import { RouterLink } from 'vue-router';
import { useWishlistStore } from '@/stores/wishlist.js';
import { useMyCartStore } from '@/stores/myCart.js';

const wishlist = ref([]);
const wishlistStore = useWishlistStore();
const cartStore = useMyCartStore();

// Fetch wishlist items from the backend API
const fetchWishlist = async () => {
  try {
   const response = await api.get('/wishlist', {
      params: { userId: customerId.value }
    });
    wishlist.value = response.data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
  }
};


const removeItem = async (wishlistId) => {
  try {
    const response = await api.delete('/wishlist/del', {
        params: { id: wishlistId, userId:customerId.value}
    });

    wishlistStore.wishlistCount = response.data.wlcount;
    wishlist.value = wishlist.value.filter(item => item.wishlistID !== wishlistId);

  } catch (error) {
    console.error("Error removing item:", error);
  }
};

// Handle adding an item to the cart
const addToCart = async (prodID) => {
   if (!isAuthenticated.value) {
        router.push('/login')
        return;
   }

  try {
   const response = await api.post('/mycart/add', null, {
        params: { 
            userId: customerId.value, 
            productId: prodID
        }
    });

    cartStore.updateCartData(response.data);

    const rescount = await api.delete('/wishlist/remove', {
        params: { userId: customerId.value, productId:prodID}
    });

    wishlistStore.wishlistCount = rescount.data.wlcount;
    wishlist.value = wishlist.value.filter(item => item.products.productID !== prodID);
    } catch (err) {
      console.error("Error add to cart:", error);
  }
};

// Load data when the component mounts
onMounted(() => {
  fetchWishlist();
});
</script>

<template>
<section id="aa-catg-head-banner">
    <img src="/img/fashion/fashion-header-bg-8.jpg" alt="fashion img">
    <div class="aa-catg-head-banner-area">
        <div class="container">
            <div class="aa-catg-head-banner-content">
                <h2>Wishlist Page</h2>
                <ol class="breadcrumb my-breadcrumb">
                    <li><router-link to="/" style="text-decoration: none;">Home</router-link></li>
                    <li class="active">Wishlist</li>
                </ol>
            </div>
        </div>
    </div>
</section>

<section id="cart-view">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="cart-view-area">
                    <div v-if="isAuthenticated" class="cart-view-table aa-wishlist-table">
                       <div v-if="wishlist.length > 0" class="table-responsive">
                            <table class="table">
                               <thead>
                                    <tr>
                                        <th>Remove</th>
                                        <th colspan="2">Product</th>
                                        <th>Price</th>
                                        <th>Balance Qty</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in wishlist" :key="item.wishlistID">
                                        <td>
                                          <Router-link class="remove" to="#" @click.prevent="removeItem(item.wishlistID)">
                                             <i class="fa fa-close"></i>
                                           </Router-link>
                                        </td>
                                        <td>
                                          <Router-link :to="`/ProdViewDet/${item.products.productID}`"><img :src="api.defaults.serURL + item.products.imageURL" :alt="item.products.altText"></Router-link>
                                        </td>
                                        <td><Router-link :to="`/ProdViewDet/${item.products.productID}`" class="aa-cart-title">{{ item.products.name }}</Router-link></td>  
                                        <td class="font-txt">{{ item.products.unitPrice }}</td>
                                        <td class="font-txt">{{ item.products.unitInStock }}</td>
                                        <td>
                                          <span v-if="item.products.unitInStock > 0" >
                                              <RouterLink class="aa-add-to-cart-btn" @click="addToCart(item.products.productID)" to="#">Add To Cart</RouterLink>
                                          </span>
                                        </td> 
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div v-else class="txt-lbl text-center">No records in Wishlist</div>
                    </div>
                    <div v-else class="txt-lbl text-center">Please login to view Wishlist</div>
                </div>
            </div>
        </div>
    </div>
</section>
</template>