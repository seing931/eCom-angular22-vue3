<script setup>
import { computed, onMounted,ref } from 'vue';
import { RouterLink } from 'vue-router';
import api from '@/api';
import { isAuthenticated, customerId } from '@/stores/authStore.js';
import { useMyCartStore } from '@/stores/myCart.js';

const cartStore = useMyCartStore();

const productStocks = ref({});

const computedSubTotal = computed(() => {
  return cartStore.cartItems.reduce((acc, item) => acc + (item.qty * item.unitPrice), 0);
});

const computedTotalAmount = computed(() => {
  return computedSubTotal.value - cartStore.discount;
});

const removeItem = async (prodID) => {
  try {

  const response = await api.post('/mycart/remove', null, {
        params: { userId: customerId.value, productId: prodID }
    });

    cartStore.updateCartData(response.data);
    delete productStocks.value[prodID];

  } catch (error) {
    console.error("Error removing item:", error);
  }
};

const fetchLiveStocks = async () => {
  if (!cartStore.cartItems.length) return;
  try {
    const prodIds = cartStore.cartItems.map(item => item.prodId);
    const response = await api.post('/mycart/bal-qty', prodIds);

    productStocks.value = response.data; 
  } catch (error) {
    console.error("Error fetching live stock values:", error);
  }
};

onMounted(async () => {
  if (isAuthenticated.value && customerId.value) {
     await fetchLiveStocks();
   }

});
</script>

<template>
<section id="aa-catg-head-banner">
    <img src="/img/fashion/fashion-header-bg-8.jpg" alt="fashion img">
    <div class="aa-catg-head-banner-area">
        <div class="container">
            <div class="aa-catg-head-banner-content">
                <h2>Cart Page</h2>
                <ol class="breadcrumb my-breadcrumb">
                    <li><router-link to="/" style="text-decoration: none;">Home</router-link></li>
                    <li class="active">Cart</li>
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
                    <div v-if="isAuthenticated" class="cart-view-table">
                       <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Remove</th>
                                        <th colspan="2">Product</th>
                                        <th>Price</th>
                                        <th>Balance Qty</th>
                                        <th>+ Qty</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in cartStore.cartItems" :key="item.prodId">
                                        <td>
                                            <router-link class="remove" to="#" @click.prevent="removeItem(item.prodId)">
                                                <fa class="fa fa-close"></fa>
                                            </router-link >
                                        </td>
                                        <td><router-link :to="`/ProdViewDet/${item.prodId}`"><img :src="api.defaults.serURL + item.prodModel?.imageURL" :alt="item.prodModel?.altText"></router-link ></td>
                                        <td><router-link :to="`/ProdViewDet/${item.prodId}`" class="aa-cart-title" >{{ item.prodName }}</router-link ></td>
                                        <td class="font-txt">{{ item.unitPrice }}</td>
                                        <td class="font-txt">{{ productStocks[item.prodId] !== undefined ? productStocks[item.prodId] : 'Loading...' }}</td>
                                        <td class="font-txt">
                                            <input type="number" class="aa-cart-quantity" maxlength="2" min="1" max="99" v-model.number="item.qty"
                                            @input="if (productStocks[item.prodId] && item.qty > productStocks[item.prodId]) {item.qty = productStocks[item.prodId]; }
                                            if (item.qty < 1) item.qty = 1;"/>
                                        </td>
                                        <td class="font-txt"><strong>{{ item.qty * item.unitPrice }}</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <!-- Cart Total view -->
                        <div class="cart-view-total">
                            <h4>Cart Totals</h4>
                            <table class="aa-totals-table">
                                <tbody>
                                    <tr>
                                        <th class="font-txt">Subtotal</th>
                                        <td class="font-txt">{{ computedSubTotal }}</td>
                                    </tr>
                                    <tr>
                                        <th class="font-txt">Discount</th>
                                        <td class="font-txt">{{ cartStore.discount }}</td>
                                    </tr>
                                    <tr>
                                        <th class="font-txt">Total Amount</th>
                                        <td class="font-txt">{{ computedTotalAmount }}</td>
                                    </tr>
                                </tbody>
                                <tfoot>           
                                    <tr>
                                        <td colspan="2">
                                            <router-link to="/Checkout">
                                                <button class="aa-cart-view-btn">Proced to Checkout</button>
                                            </router-link>
                                        </td> 
                                    </tr>
                                </tfoot>
                            </table>                             
                        </div>
                    </div>
                    <div v-else class="txt-lbl text-center">Please login to view My Chart</div>
                </div>
            </div>
        </div>
    </div>
</section>
</template>