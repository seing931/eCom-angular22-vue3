<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from 'vue-router';
import api from '../api';

// 1. Define missing state variables
const keyword = ref("");
const page = ref(1);
const pageSize = ref(6);
const products = ref([]);
const pagination = ref({});

const router = useRouter(); // For changing the route
const route = useRoute();   // For reading the current route query

// 2. Fetch function that extracts variables properly
const fetchProducts = async () => {
  // Read 'term' from the current URL query, fallback to empty string
  const term = route.query.term || ""; 
  
  let url = '/prod/filter-by-prod';
  try {
    // Note the .value for ref variables inside <script>
    const res = await api.get(url, { 
      params: { 
        term, 
        page: page.value, 
        pageSize: pageSize.value
      } 
    });
    
    products.value = res.data.items;
    pagination.value = res.data.meta;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// 3. Search function called when the user clicks the button or hits enter
const handleSearch = () => {
  // Push the keyword to the URL query string. 
  // This automatically updates the URL and triggers our watcher below.
  router.push({
    path: '/prod',
    query: { 
      term: keyword.value, 
      page: 1, 
      pageSize: pageSize.value 
    }
  });
};

// 4. Watch for changes in the URL query so fetching updates automatically
// (e.g., if a user goes back/forward or modifies the URL)
watch(() => route.query.term, () => {
  fetchProducts();
});

// 5. Fetch on initial component load
onMounted(() => {
  // Synchronize input box with URL if it already has a term on page load
  if (route.query.term) {
    keyword.value = route.query.term;
  }
  fetchProducts();
});
</script>

<template>
  <div class="aa-search-box">
    <input
      v-model="keyword"
      type="text"
      placeholder="Search product here..."
      @keyup.enter="handleSearch" />

    <button @click="handleSearch">
      <span class="fa fa-search"></span>
    </button>
  </div>
</template>