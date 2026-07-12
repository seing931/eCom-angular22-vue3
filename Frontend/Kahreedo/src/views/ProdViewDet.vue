<script setup>
import { ref, watch} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2'; 
import api from '@/api';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProdCard from '@/components/ProdCard.vue';
import { isAuthenticated,customerId } from '@/stores/authStore.js';
import { useWishlistStore } from '@/stores/wishlist.js';
import { useMyCartStore } from '@/stores/myCart.js';


const route = useRoute();
const router = useRouter();
const wishlistStore = useWishlistStore();
const cartStore = useMyCartStore();
//const quantity = ref(1);
const product = ref({});
const reviews = ref([]);
const relatedprd = ref([]);
const totalReviews = ref(0);
const avgRate = ref(0);
const activeTab = ref('desc');
// Swiper Configuration for all sliders
const swiperOptions = {
    modules: [Navigation, Pagination, Autoplay],
    slidesPerView: 4,
    spaceBetween: 20,
    loop: false,
    navigation: true,
    breakpoints: {
        1024: { slidesPerView: 4 },
        768: { slidesPerView: 3 },
        480: { slidesPerView: 2 },
        0: { slidesPerView: 1 }
    }
};

const rate = ref(1);
const reviewText = ref('');
const reviewName = ref('');
const reviewEmail = ref('');

const serverMessage = ref('');
const isSubSuccess = ref(false);

const fetchProductDetails = async () => {
  try {
    // Setting up the URL and query parameters (?id=9)
    const url = `/prod/view`;
    const res = await api.get(url, { params: {id: route.params.id} });

    product.value = res.data.product;
    reviews.value = res.data.reviews; 
    relatedprd.value= res.data.relatedprd;
    totalReviews.value = res.data.totalReviews;
    avgRate.value = res.data.avgRate;

  } catch (error) {
    console.error("Error fetching data:", error);
  } 
};

const addToCart = async () => {
   if (!isAuthenticated.value) {
        router.push('/login')
        return;
   }

  try {
   const response = await api.post('/mycart/add', null, {
        params: { 
            userId: customerId.value, 
            productId: route.params.id 
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


const addToWishlist = async () => {
   if (!isAuthenticated.value) {
        router.push('/login')
        return;
   }

  try {
    const response = await api.post('/wishlist/add', null, {
        params: { 
            userId: customerId.value, 
            productId: route.params.id 
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

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
};

const submitReview = async () => {
  try {
    // 1. Reset state before sending the request
    serverMessage.value = ''; 
    isSubSuccess.value = false;

    // 2. Build FormData for your C# [FromForm] endpoint
    const formData = new FormData();
    formData.append('CustID', customerId.value);
    formData.append('ProdID', route.params.id);
    formData.append('Name', reviewName.value);
    formData.append('Email', reviewEmail.value);
    formData.append('ReviewText', reviewText.value);
    formData.append('Rate', rate.value);

    // 3. Post to API
    const res = await api.post('/prod/review', formData);

    if (res.status === 200) {
      isSubSuccess.value = true;
      serverMessage.value = res.data.message || "Add review successfully";
      reviewText.value = '';
      await fetchProductDetails(); 
    }
  } catch (err) {
    isSubSuccess.value = false;
    serverMessage.value = err.response?.data?.message || err.message || 'Failed to submit review.';
  }
};

watch(
    () => route.params.id,
    async () => {
        await fetchProductDetails();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    { immediate: true }
);

/* watch(quantity, (newValue) => {
    if (newValue > product.value?.unitInStock) {
        quantity.value = product.value.unitInStock;
    }
    if (newValue < 1) {
        quantity.value = 1;
    }
}); */
</script>

<template>
 <section id="aa-product-details">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="aa-product-details-area">
                    <div class="aa-product-details-content">
                        <div class="row">
                            <div class="col-md-5 col-sm-5 col-xs-12">
                                <div class="aa-product-view-slider">
                                    <div id="demo-1" class="simpleLens-gallery-container">
                                        <div class="simpleLens-container">
                                            <div class="simpleLens-big-image-container">
                                                <RouterLink data-lens-image="product?.imageURL" class="simpleLens-lens-image" to="/">
                                                    <img :src="api.defaults.serURL + product?.imageURL" :alt="product?.altText" class="simpleLens-big-image" style="height:340px;width:280px">
                                                </RouterLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-7 col-sm-7 col-xs-12">
                                <div class="aa-product-view-content">
                                    <h3><strong>{{ product.name }}</strong></h3> 
                                    <div class="aa-product-rating" style="font-size: 16px;">
                                        <span 
                                            v-for="i in 5" 
                                            :key="'avg-star-' + i" 
                                            :class="avgRate >= i ? 'fa fa-star' : 'fa fa-star-o'" 
                                            style="color: #ff6600">
                                        </span>
                                    </div>
                                    <div class="aa-price-block" style="font-size: 16px;">
                                        <span class="aa-product-view-price">Rs. <b>{{ product?.unitPrice }}</b></span>
                                         <p v-if="product.unitInStock > 0" class="aa-product-avilability">
                                            <span style="color: white; background-color: green">
                                                Stock In Qty : {{ product?.unitInStock }}
                                            </span>
                                        </p>
                                        <p v-else class="aa-product-avilability">
                                            <span style="color: white; background-color: red">Out of Stock</span>
                                        </p>
                                    </div>
                                    <p style="font-size: 16px;">{{ product?.shortDescription }}</p>
                                   <!--  <div v-if="product.unitInStock > 0" class="aa-prod-quantity">
                                        <h4>Quantity:</h4>
                                        <form style="font-size:16px">
                                            <input type="number" name="quantity" min="1" :max="product?.unitInStock" v-model.number="quantity" />                                            
                                        </form>                                       
                                    </div> -->
                                    <div class="aa-prod-view-bottom">
                                        <span v-if="product.unitInStock > 0" >
                                            <RouterLink class="aa-add-to-cart-btn" @click="addToCart" to="#">Add To Cart</RouterLink>
                                        </span>
                                        <RouterLink class="aa-add-to-cart-btn" @click="addToWishlist" to="#">Wishlist</RouterLink> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="aa-product-inner">
                         <ul class="nav nav-tabs aa-products-tab">
                            <li :class="{ 'active': activeTab === 'desc' }">
                                <router-link to="#" @click.prevent="activeTab = 'desc'">Description</router-link>
                            </li>
                            <li :class="{ 'active': activeTab === 'review' }">
                                <router-link to="#" @click.prevent="activeTab = 'review'">Reviews</router-link>
                            </li>
                        </ul>
                        <!-- Tab panes -->
                        <div class="tab-content" style="font-size: 16px;margin-top:3rem">
                             <div class="tab-pane" :class="{ 'active': activeTab === 'desc' }" id="desc">
                               <div v-html="product?.longDescription"></div>
                            </div>
                            <div class="tab-pane" :class="{ 'active': activeTab === 'review' }" id="review">
                                <div class="aa-product-review-area">
                                    <h4><b>{{ totalReviews }}</b> Reviews for {{ product?.name }}</h4>
                                    <ul class="aa-review-nav">
                                        <li v-for="(item, index) in reviews" :key="index">
                                            <div class="media">
                                            <div class="media-left">
                                                <a href="#">
                                                    <img class="media-object custom-avatar" :src="item.picture ? item.picture : '/img/testimonial-img-3.jpg'" alt="item.lastName">
                                                </a>
                                            </div>
                                            <div class="media-body">
                                                <h4 class="media-heading">
                                                    <strong>{{ item.name }}</strong> - <span>{{ formatDate(item.dateTime) }}</span>
                                                </h4>
                                                <div class="aa-product-rating">
                                                <span 
                                                    v-for="i in 5" 
                                                    :key="'review-star-' + i"
                                                    :class="item.rate >= i ? 'fa fa-star' : 'fa fa-star-o'"></span>
                                                </div>
                                                <p>{{ item.reviewText }}</p> 
                                            </div>
                                            </div>
                                        </li>
                                    </ul>
                                    <h4>Add a review</h4>
                                    <div v-if="isAuthenticated" class="aa-review-form">
                                        <div class="aa-your-rating">
                                            <p>Your Rating</p>
                                            <input v-model="rate" type="number" name="rate" min="1" max="5" maxlength="1"/>
                                        </div> 
                                        <div class="form-group">
                                            <label for="message">Your Review</label>
                                            <textarea v-model="reviewText" class="form-control custom-form-input" rows="5" name="message"></textarea>
                                        </div>
                                        <div class="form-group">
                                            <label for="name">Name</label>
                                            <input v-model="reviewName" type="text" class="form-control custom-form-input" name="name" placeholder="Name">
                                        </div>
                                        <div class="form-group">
                                            <label for="email">Email</label>
                                            <input v-model="reviewEmail" type="email" class="form-control custom-form-input" name="email" placeholder="example@gmail.com">
                                        </div>
                                        <button type="submit" @click.prevent="submitReview" class="aa-browse-btn">Submit</button>
                                        <p v-if="serverMessage" :class="['inline-txt txt-lbl server-msg', isSubSuccess ? 'success-msg' : 'error-msg']">
                                            {{ serverMessage }}
                                        </p>
                                    </div>
                                    <label v-else class="login-prompt">
                                        Please login to add your important review about product.
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br /><br />
                    <div class="aa-product-related-item">
                        <div class="txt-ttl">Related Products</div>
                        <ul class="aa-product-catg aa-related-item-slider">
                            <swiper v-bind="swiperOptions">
                                <swiper-slide v-for="item in relatedprd" :key="item.productID">
                                    <ProdCard :product="item" />
                                </swiper-slide>
                            </swiper>
                        </ul>                       
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
</template>