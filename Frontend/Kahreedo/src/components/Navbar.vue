<script setup>
import { ref, onMounted, nextTick } from "vue";
import api from "../api";
import { Dropdown } from "bootstrap";

const menus = ref([]);

onMounted(async () => {
  try {
    const res = await api.get("/prod/menu");
    menus.value = res.data;

    // Wait for DOM to render the list before initializing Bootstrap dropdowns
    await nextTick();
    
    const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
    dropdownElementList.forEach(el => {
      new Dropdown(el);
    });
  } catch (error) {
    console.error("Failed to load menu:", error);
  }
});
</script>

<template>
  <ul class="navbar-nav">
    <li>
      <RouterLink to="/">Home</RouterLink>
    </li>

    <li
      v-for="menu in menus"
      :key="menu.categoryID"
      class="dropdown">

      <RouterLink
        to="#"
        class="dropdown-toggle"
        data-bs-toggle="dropdown"
        role="button">
        {{ menu.name }}
      </RouterLink>

      <ul class="dropdown-menu">
        <li
          v-for="sub in menu.subCategories"
          :key="sub.subCategoryID">
          
          <RouterLink
            :to="{ 
              path: '/prod', 
              query: { cat: menu.name.trim(), subCat: sub.name.trim(),page: 1, pageSize:6 } 
            }"
            class="dropdown-item">
            {{ sub.name.trim() }}
          </RouterLink>

        </li>
      </ul>
    </li>
  </ul>
</template>