import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/api';

export const useWishlistStore = defineStore('wishlist', () => {
  const wishlistCount = ref(0);

  const fetchCount = async (customerId, isAuthenticated) => {
    if (!customerId || !isAuthenticated) {
      wishlistCount.value = 0;
      return;
    }
    try {
      const response = await api.get('/home/count', {
        params: { usrid: customerId }
      });
      wishlistCount.value = response.data;
    } catch (error) {
      console.error("Error fetching wishlist count:", error);
    }
  };

  return {
    wishlistCount,
    fetchCount
  };
}, {
  persist: true 
});