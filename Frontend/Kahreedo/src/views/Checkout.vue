<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import api from '@/api';
import { isAuthenticated, customerId } from '@/stores/authStore.js';
import { useMyCartStore } from '@/stores/myCart.js';

const router = useRouter();
const paymentMethods = ref([]);
const selectedPaymentMethod = ref('');
const selectedProvince = ref('--');
const serverMessage = ref('');
const isOrdSuccess = ref(false);

const customer = ref({
    firstName: '',
    lastName: '',
    city: '',
    postalCode: '',
    email: '',
    mobile1: '',
    address1: ''
});
const cartStore = useMyCartStore();

const errors = ref({
    firstName: false,
    lastName: false,
    email: false,
    mobile1: false,
    address1: false,
    province: false
});

const computedSubTotal = computed(() => {
    return cartStore.cartItems.reduce((acc, item) => acc + (item.qty * item.unitPrice), 0);
});

const computedTotalAmount = computed(() => {
    return computedSubTotal.value - cartStore.discount;
});

const isPlaceOrderDisabled = computed(() => {
    return !selectedPaymentMethod.value;
});

const fetchPaymentMethods = async () => {
    try {
        const response = await api.get('/auth/pay'); 
        paymentMethods.value = response.data;
    } catch (error) {
        console.error("Error fetching payment methods:", error);
    }
};

const personalinfo = async () => {
    const id = customerId.value 
    try {
        const response = await api.get(`/cust/${id}`);
        const data = response.data;

        customer.value = {
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            city: data.city || '',
            postalCode: data.postalCode || '',
            email: data.email || '',
            mobile1: data.mobile1 || '',
            address1: data.address1 || ''
        };
        if (data.province) {
            selectedProvince.value = data.province;
        }
    } catch (error) {
        console.error("Error billing details:", error);
    }
};

const validateForm = () => {
    errors.value.firstName = !customer.value.firstName.trim();
    errors.value.lastName = !customer.value.lastName.trim();
    errors.value.email = !customer.value.email.trim();
    errors.value.mobile1 = !customer.value.mobile1.trim();
    errors.value.address1 = !customer.value.address1.trim();
    errors.value.province = selectedProvince.value === '--';
    return !Object.values(errors.value).some(error => error === true);
};

const submitOrder = async () => {
    serverMessage.value = '';
    isOrdSuccess.value = false;

    if (!validateForm()) {
        isOrdSuccess.value = false;
        serverMessage.value = "Please fill in all mandatory fields highlighted in red.";
        return;
    }

    const orderPayload = {
        CustID: customerId.value,
        PayID: selectedPaymentMethod.value,
        Name: `${customer.value.firstName} ${customer.value.lastName}`,
        CustAdd: customer.value.address1,
        ContactNo: customer.value.mobile1,
        Disc: cartStore.discount,
        Taxes: 0, 
        TotalAmt: computedTotalAmount.value,
        isCompleted: false,
        CancelOrder: false,
        
        ShipDetModel: {
            FirstName: customer.value.firstName,
            LastName: customer.value.lastName,
            Email: customer.value.email,
            Mobile: customer.value.mobile1,
            Address: customer.value.address1,
            Province: selectedProvince.value,
            City: customer.value.city,
            PostCode: customer.value.postalCode
        },
        
        Items: cartStore.cartItems.map(item => ({
            ProdId: item.prodId,
            ProdName: item.prodName,
            Qty: item.qty,
            UnitPrice: item.unitPrice,
            Disc: 0,
            TotalAmt: item.qty * item.unitPrice
        }))
    };

    try {
        const response = await api.post('/order/place-order', orderPayload);
        if (response.status === 200 || response.status === 201) {
            isOrdSuccess.value = true;
            serverMessage.value = "Order placed successfully! Redirecting...";

            setTimeout(() => {
                if (typeof cartStore.clearCart === 'function') {
                    cartStore.clearCart();
                }
                router.push('/Thankyou');
            }, 1500);
        }
    } catch (error) {
        isOrdSuccess.value = false;
        serverMessage.value = error.response?.data?.message;
        console.error("Order process failure details:", error);
    }
};

onMounted(() => {
    fetchPaymentMethods();
    if (isAuthenticated.value) {
        personalinfo();
    }
});
</script>

<template>
<section id="aa-catg-head-banner">
    <img src="/img/fashion/fashion-header-bg-8.jpg" alt="fashion img">
    <div class="aa-catg-head-banner-area">
        <div class="container">
            <div class="aa-catg-head-banner-content">
                <h2>Checkout Page</h2>
                <ol class="breadcrumb my-breadcrumb">
                    <li><router-link to="/" style="text-decoration: none;">Home</router-link></li>
                    <li class="active">Checkout</li>
                </ol>
            </div>
        </div>
    </div>
</section>

<section id="checkout">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div v-if="isAuthenticated" class="checkout-area">
                    <p v-if="serverMessage" :class="['txt-lbl server-msg', isOrdSuccess ? 'success-msg' : 'error-msg']">
                        {{ serverMessage }}
                    </p>
                    <form @submit.prevent="submitOrder">
                        <div class="row">
                         <div class="col-md-8">
                            <div class="checkout-left">
                                <div class="panel-group" id="accordion">
                                    <div class="panel panel-default aa-checkout-coupon">
                                        <div class="panel-heading">
                                            <h4 class="panel-title">
                                                <Router-link data-toggle="collapse" data-parent="#accordion" to="#collapseOne">
                                                    Have a Coupon?
                                                </Router-link>
                                            </h4>
                                         </div>
                                        <div id="collapseOne" class="panel-collapse in">
                                            <div class="panel-body">
                                                <input type="text" placeholder="Coupon Code" class="aa-coupon-code">
                                                <input type="button" value="Apply Coupon" class="aa-browse-btn">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="panel panel-default aa-checkout-billaddress">
                                        <div class="panel-heading">
                                            <h4 class="panel-title">
                                                <Router-link data-toggle="collapse" data-parent="#accordion" to="#collapseThree">
                                                    Billing Details / Shipping Address
                                                </Router-link>
                                            </h4>
                                        </div>
                                        <div id="collapseThree" class="panel-collapse">
                                            <div class="panel-body">
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <div class="aa-checkout-single-bill">
                                                            <input :class="['frm-acct-control', { 'input-error': errors.firstName }]" type="text" placeholder="First Name*" v-model="customer.firstName">
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="aa-checkout-single-bill">
                                                            <input :class="['frm-acct-control', { 'input-error': errors.lastName }]" type="text" placeholder="Last Name*" v-model="customer.lastName">
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <div class="aa-checkout-single-bill">
                                                            <input :class="['frm-acct-control', { 'input-error': errors.email }]" type="email" placeholder="Email Address*" v-model="customer.email">
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="aa-checkout-single-bill">
                                                            <input :class="['frm-acct-control', { 'input-error': errors.mobile1 }]" type="tel" placeholder="Mobile*" v-model="customer.mobile1">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <div class="aa-checkout-single-bill">
                                                            <textarea :class="['frm-acct-control', { 'input-error': errors.address1 }]" cols="8" rows="3" placeholder="Address*" v-model="customer.address1"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <div class="aa-checkout-single-bill">
                                                            <select name="Province" v-model="selectedProvince" :class="['frm-acct-control', { 'input-error': errors.province }]"> 
                                                                    <option value="--">Select Your Province*</option>
                                                                    <option value="Selangor">Selangor</option>
                                                                    <option value="Kuala Lumpur">Kuala Lumpur</option>
                                                                    <option value="Putrajaya">Putrajaya</option>
                                                                    <option value="Johor">Johor</option>
                                                                    <option value="Kedah">Kedah</option>
                                                                    <option value="Kelantan">Kelantan</option>
                                                                    <option value="Malacca">Malacca</option>
                                                                    <option value="Negeri Sembilan">Negeri Sembilan</option>
                                                                    <option value="Pahang">Pahang</option>
                                                                    <option value="Penang">Penang</option>
                                                                    <option value="Perak">Perak</option>
                                                                    <option value="Perlis">Perlis</option>
                                                                    <option value="Terengganu">Terengganu</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">                                                        
                                                    <div class="col-md-6">
                                                        <div class="aa-checkout-single-bill">
                                                            <input class="frm-acct-control" type="text" placeholder="City / Town" v-model="customer.city">
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="aa-checkout-single-bill">
                                                            <input class="frm-acct-control" type="text" placeholder="Postcode / ZIP"  v-model="customer.postalCode">
                                                        </div>
                                                    </div>
                                                </div>                                                    
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                         </div>
                         <div class="col-md-4">
                                <div class="checkout-right">
                                    <h4>Order Summary</h4>
                                     <div class="aa-order-summary-area">
                                        <table class="table table-responsive">
                                            <thead>
                                                <tr>
                                                    <th class="font-txt">Product</th>
                                                    <th class="font-txt text-end">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                               <tr v-for="item in cartStore.cartItems" :key="item.prodId">
                                                <td class="font-txt text-start">{{ item.prodName }} <strong> x {{ item.qty }}</strong></td>
                                                <td class="font-txt text-end">${{ item.qty * item.unitPrice }}</td>
                                            </tr>
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <th class="font-txt text-end">Subtotal</th>
                                                   <td class="font-txt text-end">${{ computedSubTotal }}</td>
                                                </tr>
                                                <tr>
                                                    <th class="font-txt text-end">Discount</th>
                                                    <td class="font-txt text-end">-${{ cartStore.discount }}</td>
                                                </tr>
                                                <tr>
                                                    <th class="font-txt text-end">Sum Total</th>
                                                  <td class="font-txt text-end"><strong>${{ computedTotalAmount }}</strong></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    <h4>Payment Method</h4>
                                    <div class="aa-payment-method">
                                        <div class="aa-checkout-single-bill aa-checkout-billaddress">
                                            <div class="form-group">
                                                <div class="col-md-10">
                                                    <select id="paymentMethod" v-model="selectedPaymentMethod" class="frm-acct-control" name="PaymentMethod">
                                                        <option value="" disabled>-- Payment Method --</option>
                                                        <option v-for="method in paymentMethods" :key="method.typeID" :value="method.typeID">
                                                            {{ method.typeName }}
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <br /><br />
                                        <img src="https://www.paypalobjects.com/webstatic/mktg/logo/AM_mc_vs_dc_ae.jpg" border="0" alt="PayPal Acceptance Mark">
                                        <input type="submit" value="Place Order" class="aa-browse-btn" :disabled="isPlaceOrderDisabled">
                                    </div>
                                </div>
                         </div>
                        </div>
                    </form>
                </div>
                <div v-else class="checkout-area">
                    <div class="row">
                        <span class="txt-lbl text-center">Please login to checkout ! </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
</template>

<style scoped>
.input-error {
    border: 1px solid #ff4d4d !important;
    background-color: #fff6f6 !important;
}

.server-msg {
    padding: 12px 20px;
    margin-bottom: 20px;
    border-radius: 4px;
    font-weight: bold;
    text-align: center;
}

.error-msg {
    color: #a94442;
    background-color: #f2dede;
    border: 1px solid #ebccd1;
}

.success-msg {
    color: #3c763d;
    background-color: #dff0d8;
    border: 1px solid #d6e9c6;
}
</style>