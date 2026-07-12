<script setup>
import { isAuthenticated } from '@/stores/authStore.js';
</script>

<style scoped>
h2 {
    color: #3fc35f;
}

.custom-link {
  color: #333333; /* Put your desired color hex code here */
  text-decoration: none; /* Removes the underline */
}
</style>

<template>
<section id="aa-error">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="aa-error-area">
                    <h2>Thank You</h2>
                    <div v-if="isAuthenticated">
                        <span>Your order is complete !</span>
                        <p>Thank you for shopping with us. We appreciate your business and will send a tracking link as soon as your package ships.</p>
                    </div>
                    <div v-else>
                        <span>Please login to order items!</span>
                    </div>
                    <RouterLink to="/" class="custom-link"> Go to Homepage</RouterLink>
                </div>
            </div>
        </div>
    </div>
</section>
</template>