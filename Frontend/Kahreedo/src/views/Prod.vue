<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api';
import { customerId } from '@/stores/authStore.js';
import ProdCard from '@/components/ProdCard.vue';

const route = useRoute();
const router = useRouter();

// --- STATE ---
const products = ref([]);
const pagination = ref({});
const sidebarData = ref({
  categories: [],
  topProducts: [],
  recentProducts: []
});

// --- COMPUTED ---
const cat = computed(() => route.query.cat || '');
const subCat = computed(() => route.query.subCat || '');
const term = computed(() => route.query.term || '');
const title = computed(() => {
  if (term.value) return term.value;
  if (subCat.value!== '0') {
    return subCat.value;
  }
  return '';
});
const page = ref(Number(route.query.page) || 1);
const pageSize = ref(Number(route.query.pageSize) || 6);
const minPrice = ref(Number(0));
const maxPrice = ref(Number(999));

const changePageSize = async () => {
    await router.push({
        query: {
            cat: cat.value,
            subCat: subCat.value,
            page: page.value,
            pageSize: pageSize.value
        }
    });

    await fetchProducts();
};

const filterByPrice = async () => {
    await router.push({
        query: {
            cat:cat.value,
            subCat: subCat.value ? subCat.value : "0",
            minPrice: minPrice.value,
            maxPrice: maxPrice.value,
            page: page.value,
            pageSize: pageSize.value
        }
    });

    await fetchProducts();
};

// --- LOGIC ---
const fetchProducts = async () => {
  const { cat, subCat, term, minPrice, maxPrice, page, pageSize } = route.query;
  
  let url = '/prod/filter-cat';
  if (subCat) url = '/prod/filter';
  if (maxPrice>0) url ='/prod/filter-by-price';
  if (term) url ='/prod/filter-by-prod';
  
  try {
    const res = await api.get(url, { params: { cat, subCat, term, minPrice, maxPrice, page, pageSize} });
    products.value = res.data.items;
    pagination.value = res.data.meta;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const fetchSidebar = async () => {
  try {
    const res = await api.get('/prod/sidebar', { params: { usrid: customerId.value ? customerId.value : 0}});
    sidebarData.value = res.data;
  } catch (error) {
    console.error("Error fetching sidebar:", error);
  }
};


onMounted(() => {
  fetchSidebar();
  fetchProducts();
});

// Watch URL changes to refresh products, but NOT the sidebar 
// (Sidebar only needs to be fetched once usually)
watch(() => route.query, fetchProducts);
</script>


<template>
<section id="aa-catg-head-banner">
    <img src="/img/fashion/fashion-header-bg-8.jpg" alt="fashion img">
    <div class="aa-catg-head-banner-area">
        <div class="container">
            <div class="aa-catg-head-banner-content">
                <h2>{{ title }}</h2>
                <ol class="breadcrumb my-breadcrumb">
                    <li><router-link to="/" style="text-decoration: none;">Home</router-link></li>
                    <li class="active">{{cat}}</li>
                </ol>
            </div>
        </div>
    </div>
</section>
<section id="aa-product-category">
    <div class="container">
        <div class="row">
            <div class="col-lg-9 col-md-9 col-sm-8 col-md-push-3">
                <div class="aa-product-catg-content">
                    <div class="aa-product-catg-head">
                        <div class="aa-product-catg-head-left">
                            <label>Sort by</label>
                            <select name="sortBy"  >
                                <option value="Default" selected> Default</option>
                                <option value="Name"> Name</option>
                                <option value="Price">Price</option>
                                <option value="Date">Date</option>
                              </select>
                            <label>Show</label>
                            <select v-model.number="pageSize" @change="changePageSize">
                                <option :value="6">6</option>
                                <option :value="18">18</option>
                                <option :value="30">30</option>
                                <option :value="42">42</option>
                                <option :value="54">54</option>
                                <option :value="66">66</option>
                                <option :value="78">78</option>
                                <option :value="90">90</option>
                            </select>
                        </div>
                        <div class="aa-product-catg-head-right">
                            <router-link id="grid-catg" to="#"><span class="fa fa-th"></span></router-link>
                        </div>
                    </div>
                    <div class="aa-product-catg-body">
                        <ul class="aa-product-catg">
                          <ProdCard
                             v-for="item in products"
                             :key="item.productID"
                             :product="item"
                            />
                        </ul>
                    </div>
                    <div class="aa-product-catg-pagination">
                        
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-4 col-md-pull-9">
                <aside class="aa-sidebar">
                    <!-- single sidebar -->
                    <div class="aa-sidebar-widget">
                        <h3>Category</h3>
                        <ul class="aa-catg-nav">
                            <li v-for="cat in sidebarData.categories" :key="cat">
                                <RouterLink :to="{ path: '/prod', query: { cat: cat.trim(), page: 1,pageSize:6 } }">{{ cat }}</RouterLink>
                            </li>
                        </ul>
                    </div>
                    <!-- single sidebar -->
                    <div class="aa-sidebar-widget">
                        <h3>Tags</h3>
                        <div class="tag-cloud">
                            <router-link to="#">Fashion</router-link>
                            <router-link to="#">Ecommerce</router-link>
                            <router-link to="#">Shop</router-link>
                            <router-link to="#">Hand Bag</router-link>
                            <router-link to="#">Laptop</router-link>
                            <router-link to="#">Head Phone</router-link>
                            <router-link to="#">Pen Drive</router-link>
                        </div>
                    </div>
                    <!-- single sidebar -->
                    <div class="aa-sidebar-widget">
                        <h3>Shop By Price</h3>
                        <!-- price range -->
                        <div class="aa-sidebar-price-range">                         
                           <input type="range" min="0" max="999" v-model="minPrice"><br />
                           <input type="range" min="0" max="999" v-model="maxPrice"><br />
                            <div class="filter-container">
                                <div class="input-row">
                                   <input type="number" v-model.number="minPrice" min="0" max="999999" class="price-input">
                                   <input type="number" v-model.number="maxPrice" min="0" max="999999" class="price-input">
                                </div>
                                <button class="aa-filter-btn" @click="filterByPrice">Filter</button>
                           </div>
                        </div>
                    </div>
                    <!-- single sidebar -->
                  
                    <!-- single sidebar -->
                    <div class="aa-sidebar-widget">
                        <h3>Top Sold Products</h3>
                        <div class="aa-recently-views">
                         <ul>
                            <li v-for="item in sidebarData.topProducts" :key="item.product.productID">
                                <RouterLink :to="`/ProdViewDet/${item.product.productID}`" class="aa-cartbox-img">
                                    <img :alt="item.product.altText" :src="api.defaults.serURL + item.product.imageURL">
                                </RouterLink>
                                <div class="aa-cartbox-info">
                                <h4>
                                    <b><RouterLink :to="`/ProdViewDet/${item.product.productID}`">{{ item.product.name }}</RouterLink></b>
                                </h4>
                                    <p>Sold: {{ item.countSold }}</p>
                                </div>
                            </li>
                         </ul>
                        </div>
                    </div>
                    <!-- single sidebar -->
                    <div class="aa-sidebar-widget">
                        <h3>Recently Views</h3>
                        <div class="aa-recently-views">
                            <ul>
                              <li v-for="item in sidebarData.recentProducts" :key="item.productID">
                                <RouterLink :to="`/ProdViewDet/${item.productID}`" class="aa-cartbox-img">
                                    <img :alt="item.altText" :src="api.defaults.serURL + item.imageURL">
                                </RouterLink>
                                <div class="aa-cartbox-info">
                                    <h4>
                                        <b><RouterLink :to="`/ProdViewDet/${item.productID}`">{{ item.name }}</RouterLink></b>
                                    </h4>
                                    <p>Rs. {{ item.unitPrice }}</p>
                                </div>
                             </li>                
                            </ul>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    </div>
</section>
</template>