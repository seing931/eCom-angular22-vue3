<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import SwiperCore from 'swiper';
import ProdCard from '@/components/ProdCard.vue';

const sliderData = ref([]);
const promoRight = ref([]);
const allProducts = ref({ 
    men: [], women: [], sports: [], electronics: [],
    popular: [], featured: [], latest: [] 
});

const activeTab = ref('men');
const activePopularTab = ref('popular');

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

onMounted(async () => {
    try {
        SwiperCore.use([Autoplay, Navigation]);
        const res = await api.get('/home/index');
        sliderData.value = res.data.slider;
        promoRight.value = res.data.promoRight;
        allProducts.value = {
            men: res.data.menProduct,
            women: res.data.womenProduct,
            sports: res.data.sportsProduct,
            electronics: res.data.electronicsProduct,
            popular: res.data.menProduct, // Map accordingly
            featured: res.data.sportsProduct,
            latest: res.data.electronicsProduct
        };
    } catch (err) {
        console.error("API Error:", err);
    }
});
</script>

<template>
<!-- Start slider -->
<section id="aa-slider">
    <div class="aa-slider-area">
        <div id="sequence" class="seq">
            <div class="seq-screen">
                <ul class="seq-canvas">
                  <!-- single slide item -->
                  <swiper v-if="sliderData.length > 0"
                        :modules="modules"
                        :navigation="{ nextEl: '.seq-next', prevEl: '.seq-prev' }"
                        :loop="sliderData.length > 1" 
                        :autoplay="{ 
                            delay: 3000, 
                            disableOnInteraction: false 
                        }">
                        <swiper-slide v-for="item in sliderData" :key="item.mainSliderID">
                            <img :src="item.imageURL" :alt="item.altText" />
                            <div class="seq-title">
                                <span>{{ item.offerTag }}</span>
                                <h2 style="opacity: 1; color: #000;margin-left:12rem;">{{ item.title }}</h2>
                                <p style="opacity: 1; display: block; color: #000;">{{ item.description }}</p>
                                <router-link to="/prod" class="aa-shop-now-btn aa-secondary-btn">
                                    {{ item.btnText }}
                                </router-link>
                            </div>
                        </swiper-slide>
                        <!-- end single slide item -->
                  </swiper>
                </ul>
            </div>
            <!-- slider navigation btn -->
            <fieldset class="seq-nav" aria-controls="sequence" aria-label="Slider buttons">
                <router-link type="button" to="" class="seq-prev" aria-label="Previous"><span class="fa fa-angle-left"></span></router-link>
                <router-link type="button" to="" class="seq-next" aria-label="Next"><span class="fa fa-angle-right"></span></router-link>
            </fieldset>
        </div>
    </div>
</section>
<!-- End slider -->

<!-- Start Promo section -->
<section id="aa-promo">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="aa-promo-area">
                    <div class="row">
                        <!-- promo left -->
                        <div class="col-md-5 no-padding">
                            <div class="aa-promo-left">
                                <div class="aa-promo-banner">
                                    <img src="/img/promo-banner-womens.jpg" alt="img">
                                    <div class="aa-prom-content">
                                        <span>75% Off</span>
                                        <h4><router-link to="/">For Women</router-link></h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- promo right -->
                        <div class="col-md-7 no-padding">
                            <div class="aa-promo-right">
                                <div v-for="item in promoRight":key="item.promoRightID" class="aa-single-promo-right">
                                  <div class="aa-promo-banner">
                                      <img :src="item.imageURL" :alt="item.altText" />
                                      <div class="aa-prom-content">
                                          <span>{{ item.offerTag }}</span>
                                          <h4>
                                              <!-- Use RouterLink for internal navigation -->
                                              <router-link :to="{ path: '/prod', query: { cat: item.name, page: 1, pageSize: 6 } }">
                                                {{ item.title }}
                                            </router-link>
                                          </h4>
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
</section>
<!-- End Promo section -->

<!-- Start Products section -->
<section id="aa-product">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="row">
                    <div class="aa-product-area">
                        <div class="aa-product-inner">
                            <!-- start prduct navigation -->
                           <ul class="nav nav-tabs aa-products-tab">
                                <li :class="{ 'active': activeTab === 'men' }">
                                    <router-link to="#" @click.prevent="activeTab = 'men'">Men</router-link>
                                </li>
                                <li :class="{ 'active': activeTab === 'women' }">
                                    <router-link to="#" @click.prevent="activeTab = 'women'">Women</router-link>
                                </li>
                                <li :class="{ 'active': activeTab === 'sports' }">
                                    <router-link to="#" @click.prevent="activeTab = 'sports'">Sports</router-link>
                                </li>
                                <li :class="{ 'active': activeTab === 'electronics' }">
                                    <router-link to="#" @click.prevent="activeTab = 'electronics'">Electronics</router-link>
                                </li>
                            </ul>
                            <!-- Tab panes -->
                            <div class="tab-content" style="margin-top:20px">
                            <div class="tab-pane" :class="{ 'active': activeTab === 'men' }" id="men">
                                <ul class="aa-product-catg">
                                <ProdCard
                                    v-for="item in allProducts.men" 
                                    :key="item.productID"
                                    :product="item" 
                                />
                                </ul>
                                <div class="brw-all">
                                     <router-link class="aa-browse-btn" to="/prod?cat=Men&page=1&pageSize=6">Browse all Product <span class="fa fa-long-arrow-right"></span></router-link>
                                </div>
                            </div>
                            <div class="tab-pane" :class="{ 'active': activeTab === 'women' }" id="women">
                                <ul class="aa-product-catg">
                                <ProdCard
                                    v-for="item in allProducts.women"
                                    :key="item.productID"
                                    :product="item"
                                />
                                </ul>
                                <div class="brw-all">
                                     <router-link class="aa-browse-btn" to="/prod?cat=Women&page=1&pageSize=6">Browse all Product <span class="fa fa-long-arrow-right"></span></router-link>
                                </div>
                            </div>

                            <div class="tab-pane" :class="{ 'active': activeTab === 'sports' }" id="sports">
                                <ul class="aa-product-catg">
                                <ProdCard
                                    v-for="item in allProducts.sports"
                                    :key="item.productID"
                                    :product="item"
                                />
                                </ul>
                                 <div class="brw-all">
                                    <router-link class="aa-browse-btn" to="/prod?cat=Sports&page=1&pageSize=6">Browse all Product <span class="fa fa-long-arrow-right"></span></router-link>
                                </div>
                            </div>

                            <div class="tab-pane" :class="{ 'active': activeTab === 'electronics' }" id="electronics">
                                <ul class="aa-product-catg">
                                <ProdCard
                                    v-for="item in allProducts.electronics"
                                    :key="item.productID"
                                    :product="item"
                                />
                                </ul>
                                 <div class="brw-all">
                                    <router-link class="aa-browse-btn" to="/prod?cat=Phones&page=1&pageSize=6">Browse all Product <span class="fa fa-long-arrow-right"></span></router-link>
                                </div>
                            </div>
                            </div>
                            <!-- quick view modal -->
                            <div class="modal fade" id="quick-view-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-body">
                                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                            <div class="row">
                                                <!-- Modal view slider -->
                                                <div class="col-md-6 col-sm-6 col-xs-12">
                                                    <div class="aa-product-view-slider">
                                                        <div class="simpleLens-gallery-container" id="demo-1">
                                                            <div class="simpleLens-container">
                                                                <div class="simpleLens-big-image-container">
                                                                    <router-link to="#" class="simpleLens-lens-image" data-lens-image="img/view-slider/large/polo-shirt-1.png">
                                                                        <img src="/img/view-slider/medium/polo-shirt-1.png" class="simpleLens-big-image">
                                                                    </router-link>
                                                                </div>
                                                            </div>
                                                            <div class="simpleLens-thumbnails-container">
                                                                <router-link to="#" class="simpleLens-thumbnail-wrapper"
                                                                   data-lens-image="img/view-slider/large/polo-shirt-1.png"
                                                                   data-big-image="img/view-slider/medium/polo-shirt-1.png">
                                                                    <img src="/img/view-slider/thumbnail/polo-shirt-1.png">
                                                                </router-link>
                                                                <router-link to="#" class="simpleLens-thumbnail-wrapper"
                                                                   data-lens-image="img/view-slider/large/polo-shirt-3.png"
                                                                   data-big-image="img/view-slider/medium/polo-shirt-3.png">
                                                                    <img src="/img/view-slider/thumbnail/polo-shirt-3.png">
                                                                </router-link>

                                                                <router-link to="#" class="simpleLens-thumbnail-wrapper"
                                                                   data-lens-image="img/view-slider/large/polo-shirt-4.png"
                                                                   data-big-image="img/view-slider/medium/polo-shirt-4.png">
                                                                    <img src="/img/view-slider/thumbnail/polo-shirt-4.png">
                                                                </router-link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- Modal view content -->
                                                <div class="col-md-6 col-sm-6 col-xs-12">
                                                    <div class="aa-product-view-content">
                                                        <h3>T-Shirt</h3>
                                                        <div class="aa-price-block">
                                                            <span class="aa-product-view-price">$34.99</span>
                                                            <p class="aa-product-avilability">Avilability: <span>In stock</span></p>
                                                        </div>
                                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis animi, veritatis quae repudiandae quod nulla porro quidem, itaque quis quaerat!</p>
                                                        <h4>Size</h4>
                                                        <div class="aa-prod-view-size">
                                                            <router-link to="#">S</router-link>
                                                            <router-link to="#">M</router-link>
                                                            <router-link to="#">L</router-link>
                                                            <router-link to="#">XL</router-link>
                                                        </div>
                                                        <div class="aa-prod-quantity">
                                                            <form action="">
                                                                <select name="" id="">
                                                                    <option value="0" selected="1">1</option>
                                                                    <option value="1">2</option>
                                                                    <option value="2">3</option>
                                                                    <option value="3">4</option>
                                                                    <option value="4">5</option>
                                                                    <option value="5">6</option>
                                                                </select>
                                                            </form>
                                                            <p class="aa-prod-category">
                                                                Category: <router-link to="#">Polo T-Shirt</router-link>
                                                            </p>
                                                        </div>
                                                        <div class="aa-prod-view-bottom">
                                                            <router-link to="#" class="aa-add-to-cart-btn"><span class="fa fa-shopping-cart"></span>Add To Cart</router-link>
                                                            <router-link to="#" class="aa-add-to-cart-btn">View Details</router-link>
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
                </div>
            </div>
        </div>
    </div>
</section>
<!-- End Products section -->

<!-- Start banner section -->
<section id="aa-banner">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="row">
                    <div class="aa-banner-area">
                        <RouterLink to="#"><img src="/img/fashion-banner.jpg" alt="fashion banner img"></RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- End banner section -->
 
<!-- popular section -->
<section id="aa-popular-category">
    <div class="container">
        <ul class="nav nav-tabs aa-products-tab">
            <li v-for="tab in ['popular', 'featured', 'latest']" :key="tab" :class="{ 'active': activePopularTab === tab }">
                <RouterLink to="#" @click.prevent="activePopularTab = tab">{{ tab.toUpperCase() }}</RouterLink>
            </li>
        </ul>
        <div class="tab-content" style="margin-top:20px">
            <div v-for="tab in ['popular', 'featured', 'latest']" :key="tab" class="tab-pane" :class="{ 'active': activePopularTab === tab }">
                <ul class="aa-product-catg">
                    <swiper v-bind="swiperOptions">
                        <swiper-slide v-for="item in allProducts[tab]" :key="item.productID">
                            <ProdCard :product="item" />
                        </swiper-slide>
                    </swiper>
                </ul>
            </div>
        </div>
    </div>
</section>
<!-- End popular section -->
</template>
