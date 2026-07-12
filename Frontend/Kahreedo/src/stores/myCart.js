import { defineStore } from 'pinia';
import api from '@/api'; // Import your axios/api instance here

export const useMyCartStore = defineStore('myCart', {
  state: () => ({
    userId: null, 
    cartItems: [],
    subTotal: 0,
    discount: 0,
    totalAmount: 0,
    myCartCount: 0,
    wishlistCount: 0
  }),
  actions: {
    checkUserSession() {
      const currentStorageId = localStorage.getItem('customerId');
      const parsedId = currentStorageId ? parseInt(currentStorageId, 10) : null;

      if (this.userId !== parsedId) {
        this.clearCart();
        this.userId = parsedId; 
      }
    },

    async fetchBackendCart() {
      const currentStorageId = localStorage.getItem('customerId');
      if (!currentStorageId) return; // Don't fetch if no user is logged in

      try {
        const response = await api.get('/mycart/chkout', {
          params: { userId: parseInt(currentStorageId, 10) }
        });
        
        // Call the local action using 'this'
        this.updateCartData(response.data.result);
      } catch (error) {
        console.error("Error loading user cart:", error);
      }
    },

    updateCartData(data) {
      this.checkUserSession();

      this.userId = data.userID || data.userId || null;
      this.cartItems = data.items || [];
      this.subTotal = data.subTotal || 0;
      this.discount = data.discount || 0;
      this.totalAmount = data.ttlAmt || 0;
      this.myCartCount = data.myCartCount || 0;
      this.wishlistCount = data.wishlistCount || 0;
    },

    clearCart() {
      this.userId = null;
      this.cartItems = [];
      this.subTotal = 0;
      this.discount = 0;
      this.totalAmount = 0;
      this.myCartCount = 0;
      this.wishlistCount = 0;
    }
  },
  persist: true 
});