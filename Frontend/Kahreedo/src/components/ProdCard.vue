<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import api from '@/api'
import {isAuthenticated, customerId } from '@/stores/authStore.js';
import { useWishlistStore } from '@/stores/wishlist.js';
import { useMyCartStore } from '@/stores/myCart.js';
import Swal from 'sweetalert2'; 

const router = useRouter();
const wishlistStore = useWishlistStore();
const cartStore = useMyCartStore();
const props = defineProps({
    product: { // Keep this singular as defined
        type: Object,
        required: true
    },
    isLogin: {
        type: Boolean,
        default: false
    }
})

const addToCart = async () => {
   if (!isAuthenticated.value) {
        router.push('/login')
        return;
   }

  try {
   const response = await api.post('/mycart/add', null, {
        params: { 
            userId: customerId.value, 
            productId: props.product.productID 
        }
    });

    cartStore.updateCartData(response.data);
    
    Swal.fire({
      title: 'Success!',
      text: 'Added to Cart Successfully.',
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    });

    } catch (err) {
        Swal.fire({
        title: 'Oops!',
        text: err,
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
    });
  }
};

const addWishlist = async () => {
   if (!isAuthenticated.value) {
        router.push('/login')
        return;
   }

  try {
    const response = await api.post('/wishlist/add', null, {
        params: { 
            userId: customerId.value, 
            productId: props.product.productID 
        }
    });
    
     wishlistStore.wishlistCount = response.data.wlcount;
    
    Swal.fire({
      title: 'Success!',
      text: 'Added to Wishlist Successfully.',
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    });

    } catch (err) {
        Swal.fire({
        title: 'Oops!',
        text: err,
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
    }
}
</script>

<template>
    <li>
        <figure>
            <RouterLink class="aa-product-img" :to="`/ProdViewDet/${product.productID}`">
                <img :src="api.defaults.serURL + product.imageURL" :alt="product.altText" style="height:300px;width:250px">
            </RouterLink>

            <span v-if="product.unitInStock > 0" >
              <button class="aa-add-card-btn" @click="addToCart">
                <span class="fa fa-shopping-cart"></span>
                     Add To Cart
              </button>
            </span>
                        
            <figcaption>
                <h4 class="aa-product-title">
                    <RouterLink :to="`/ProdViewDet/${product.productID}`" style="text-decoration: none;">
                        {{ product.name }}
                    </RouterLink>
                </h4>
                <span class="aa-product-price">
                    Rs. {{ product.unitPrice }}
                    <span class="aa-product-old-price">
                        <del v-if="product.oldPrice">
                            Rs. {{ product.oldPrice }}
                        </del>
                    </span>
                </span>
            </figcaption>
        </figure>
        
        <div class="aa-product-hvr-content">
            <RouterLink to="#" @click.prevent="addWishlist" title="Add to Wishlist">
                <span class="fa fa-heart-o"></span>
            </RouterLink>
            <RouterLink :to="`/ProdViewDet/${product.productID}`" title="View Details">
                <span class="fa fa-info"></span>
            </RouterLink>
        </div>
        
        <span v-if="product.addBadge" :class="'aa-badge ' + product.offerBadgeClass">
            {{ product.offerTitle }}
        </span>
    </li>
</template>