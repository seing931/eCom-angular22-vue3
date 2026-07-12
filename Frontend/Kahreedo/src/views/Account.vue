<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';
import { customerId } from '../stores/authStore.js';

// Add a temporary state to hold the raw file object
const selectedFile = ref(null);

// Capture the file when the user selects it
const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        selectedFile.value = file;
        // 1. Create a temporary local URL for the selected file
        const previewUrl = URL.createObjectURL(file);
        
        // 2. Fix: Add .value so Vue can reactively update the template!
        customer.value.picture = previewUrl;
        customer.value.pictureName = file.name;
    }
};
// Status messages states
const serverMessage = ref('');
const isUpdSuccess = ref(false);

// 1. Define reactive state for the customer model matching your backend fields
const customer = ref({
    custId:'',
    firstName: '',
    lastName: '',
    age: null,
    gender: 'M',
    dateofBirth: '',
    organization: '',
    picture: '',
    notes: '',
    country: '',
    state: '',
    city: '',
    postalCode: '',
    email: '',
    altEmail: '',
    phone1: '',
    phone2: '',
    mobile1: '',
    mobile2: '',
    address1: '',
    address2: '',
    userName: '',
    password: ''
});

// Helper to clear messages after a few seconds
const clearMessageAfterDelay = () => {
    setTimeout(() => {
        serverMessage.value = '';
    }, 5000); // Message disappears after 5 seconds
};

// 3. Fetch data on component mount
onMounted(async () => {
    const id = localStorage.getItem('customerId');
    
    if (!id) {
        serverMessage.value = 'User session not found. Please log in again.';
        isUpdSuccess.value = false;
        return;
    }

    try {
        const response = await api.get(`/cust/${id}`);
        const data = response.data;

        // Clean up the date string so HTML <input type="date"> can safely read it
        let formattedDate = '';
        if (data.dateofBirth) {
            // Extracts just 'YYYY-MM-DD' from the timestamp
            formattedDate = data.dateofBirth.split('T')[0]; 
        }

        // Map properties explicitly to ensure casing matching doesn't mismatch
        customer.value = {
            custId: id,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            age: data.age || null,
            gender: data.gender || null,
            dateofBirth: formattedDate,
            organization: data.organization || '',
            picture: data.picture || '',
            notes: data.notes || '',
            country: data.country || '',
            state: data.state || '',
            city: data.city || '',
            postalCode: data.postalCode || '',
            email: data.email || '',
            altEmail: data.altEmail || '',
            phone1: data.phone1 || '',
            phone2: data.phone2 || '',
            mobile1: data.mobile1 || '',
            mobile2: data.mobile2 || '',
            address1: data.address1 || '',
            address2: data.address2 || '',
            userName: data.userName || '',
            password: data.password || ''
        };

    } catch (error) {
        console.error('Error fetching customer data:', error);
        // Display a cleaner error message instead of raw Axios object
        serverMessage.value = error;
        isUpdSuccess.value = false;
    }
});

// 4. Update data on form submission
const handleUpdate = async () => {
    serverMessage.value = ''; // Reset message state on new click
    const id = customerId.value || localStorage.getItem('customerId');

    try {
        const formData = new FormData();
        
        // Append all text fields from your customer model
        Object.keys(customer.value).forEach(key => {
            if (customer.value[key] !== null && customer.value[key] !== undefined) {
                formData.append(key, customer.value[key]);
            }
        });

        // Append the actual physical file if the user picked one
        if (selectedFile.value) {
            formData.append('pictureFile', selectedFile.value);
        }
        // Send the request with Multipart Headers
        const response = await api.put(`/cust/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        serverMessage.value = 'Account updated successfully!';
        isUpdSuccess.value = true;
        clearMessageAfterDelay();
    } catch (error) {
        console.error('Error updating account:', error);
        serverMessage.value = error;
        isUpdSuccess.value = false;
        clearMessageAfterDelay();
    }
};
</script>

<template>
<section id="aa-myaccount">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="aa-myaccount-area">
                    <form @submit.prevent="handleUpdate" class="row">
                        <h4>My Account</h4>
                        <div class="col-md-6">
                            <div class="aa-myaccount-register">
                                <div class="aa-login-form">
                                    <div class="form-horizontal">                                        
                                        <span style="font-size: 18px;"><strong> Personal Information</strong></span>
                                        <hr />
                                        <div class="form-group">
                                            <label class="control-label col-md-4 lbl-acct">First Name</label>
                                            <div class="col-md-8">
                                                <input type="text" class="frm-acct-control" v-model="customer.firstName">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                          <label class="control-label col-md-4 lbl-acct">Last Name</label>
                                           <div class="col-md-8">
                                              <input type="text" class="frm-acct-control" v-model="customer.lastName">
                                           </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label col-md-4 lbl-acct">Age</label>
                                            <div class="col-md-8">
                                                <input type="number" class="frm-acct-control" v-model="customer.age">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                             <label class="control-label col-md-4 lbl-acct">Gender</label>
                                            <div class="col-md-8">
                                                <label class="radio-inline">
                                                    <input type="radio" name="gender" value="M" v-model="customer.gender"> 
                                                    <p class="lbl-acct">Male</p>
                                                </label>

                                                <label class="radio-inline" style="margin-left:20px;">
                                                    <input type="radio" name="gender" value="F" v-model="customer.gender"> 
                                                      <p class="lbl-acct">Female</p>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label col-md-4 lbl-acct">Date of Birth</label>
                                            <div class="col-md-8">
                                                <input type="date" class="frm-acct-control" v-model="customer.dateofBirth">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label col-md-4 lbl-acct">Organization</label>
                                            <div class="col-md-8">
                                                <input type="text" class="frm-acct-control" v-model="customer.organization">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label col-md-4 lbl-acct">Picture</label>
                                            <div class="col-md-8">
                                               <input type="file" class="frm-acct-control" @change="handleFileUpload" accept="image/*">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label col-md-4 lbl-acct">Notes</label>
                                            <div class="col-md-8">
                                                <input type="text" class="frm-acct-control" v-model="customer.notes">
                                            </div>
                                        </div>
                                        <span style="font-size: 18px;"><strong> Contact Information</strong></span>
                                        <hr/>                                     
                                        <div class="form-group">
                                            <label class="control-label col-md-4 lbl-acct">Country</label>
                                            <div class="col-md-8">
                                               <input type="text" class="frm-acct-control" v-model="customer.country">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label col-md-4 lbl-acct">State</label>
                                            <div class="col-md-8">
                                                <input type="text" class="frm-acct-control" v-model="customer.state">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label col-md-4 lbl-acct">City</label>
                                            <div class="col-md-8">
                                               <input type="text" class="frm-acct-control" v-model="customer.city">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label col-md-4 lbl-acct">Postal Code</label>
                                            <div class="col-md-8">
                                               <input type="text" class="frm-acct-control" v-model="customer.postalCode">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                             <label class="control-label col-md-4 lbl-acct">Email</label>
                                            <div class="col-md-8">
                                                <input type="text" class="frm-acct-control" v-model="customer.email">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label col-md-4 lbl-acct">Alt Email</label>
                                            <div class="col-md-8">
                                               <input type="text" class="frm-acct-control" v-model="customer.altEmail">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label col-md-4 lbl-acct">Phone 1</label>
                                            <div class="col-md-8">
                                               <input type="text" class="frm-acct-control" v-model="customer.phone1">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label col-md-4 lbl-acct">Phone 2</label>
                                            <div class="col-md-8">
                                                <input type="text" class="frm-acct-control" v-model="customer.phone2">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label col-md-4 lbl-acct">Mobile 1</label>
                                            <div class="col-md-8">
                                               <input type="text" class="frm-acct-control" v-model="customer.mobile1">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label col-md-4 lbl-acct">Mobile 2</label>
                                            <div class="col-md-8">
                                                 <input type="text" class="frm-acct-control" v-model="customer.mobile2">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label col-md-4 lbl-acct">Address 1</label>
                                            <div class="col-md-8">
                                                <input type="text" class="frm-acct-control" v-model="customer.address1">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label col-md-4 lbl-acct">Address 2</label>
                                            <div class="col-md-8">
                                                <input type="text" class="frm-acct-control" v-model="customer.address2">
                                            </div>
                                        </div>
                                        <span style="font-size: 18px;"><strong> Login Information</strong></span>
                                        <hr/>
                                        <div class="form-group">
                                            <label class="control-label col-md-4 lbl-acct">Username</label>
                                            <div class="col-md-8">
                                               <input type="text" class="frm-acct-control" v-model="customer.userName" disabled>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label col-md-4 lbl-acct">Password</label>
                                            <div class="col-md-8">
                                                <input type="password" class="frm-acct-control" v-model="customer.password" disabled>
                                            </div>
                                        </div>
                                        <br />
                                        <div class="form-group">
                                             <div>
                                                 <p v-if="serverMessage" :class="['txt-lbl server-msg', isUpdSuccess ? 'success-msg' : 'error-msg']">{{ serverMessage }}</p>
                                            </div>
                                            <div style="float: right;">
                                                <button type="submit" class="aa-browse-btn">Update</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div style="margin:3rem 20rem;">
                             <img v-if="customer.picture" 
                                :src="api.defaults.serURL + customer.picture" 
                                :alt="customer.pictureName" 
                                class="my-img" />

                                <div v-else class="image-placeholder my-img">
                                    <i class="bi bi-image icon-placeholder"></i> 
                                    <span style="font-size: 18px;">No Image Available</span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
   </div>
</section>
</template>