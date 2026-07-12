<script setup>
import { useRouter } from 'vue-router';
import { ref, reactive } from 'vue';
import api from '../api';
import { loginUser } from '../stores/authStore.js';

const router = useRouter(); 

// --- LOGIN STATE & VALIDATION ---
const loginForm = reactive({
  UserName: '',
  Password: '',
  RememberMe: false
});
const loginErrors = reactive({});
const loginServerMessage = ref('');

const validateLogin = () => {
  loginErrors.UserName = !loginForm.UserName ? 'Username or Email is required.' : '';
  loginErrors.Password = !loginForm.Password ? 'Password is required.' : '';
  
  return !loginErrors.UserName && !loginErrors.Password;
};

const handleLogin = async () => {
  loginServerMessage.value = '';
  if (!validateLogin()) return;

  try {
    // Replaced fetch with api.post (removes manual headers and JSON.stringify)
    const response = await api.post('/auth/clogin', loginForm);
    loginUser(response.data.username, response.data.id);
    router.push('/');
    
    // TODO: Handle token storage or routing redirect here
  } catch (err) {
    // Captures C# Unauthorized("Invalid credentials") or network issues
    if (err.response) {
      loginServerMessage.value = err.response.data || "Invalid credentials.";
    } else {
      loginServerMessage.value = "Network error. Please try again.";
    }
  }
};

// --- REGISTER STATE & VALIDATION ---
const regForm = reactive({
  FirstName: '',
  LastName: '',
  UserName: '',
  Password: '',
  Email: '',
  Mobile1: '',
  Address1: ''
});
const regErrors = reactive({});
const regServerMessage = ref('');
const isRegSuccess = ref(false);

const validateRegister = () => {
  regErrors.FirstName = !regForm.FirstName ? 'First Name is required.' : '';
  regErrors.LastName = !regForm.LastName ? 'Last Name is required.' : '';
  regErrors.UserName = !regForm.UserName ? 'Username is required.' : '';
  
  if (!regForm.Password) {
    regErrors.Password = 'Password is required.';
  } else if (regForm.Password.length < 6) {
    regErrors.Password = 'Password must be at least 6 characters.';
  } else {
    regErrors.Password = '';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regForm.Email) {
    regErrors.Email = 'Email is required.';
  } else if (!emailRegex.test(regForm.Email)) {
    regErrors.Email = 'Please enter a valid email address.';
  } else {
    regErrors.Email = '';
  }

  regErrors.Mobile1 = !regForm.Mobile1 ? 'Mobile number is required.' : '';

  return !Object.values(regErrors).some(error => error !== '');
};

const handleRegister = async () => {
  regServerMessage.value = '';
  isRegSuccess.value = false;
  
  // Clear any previous errors
  regErrors.UserName = ''; 

  if (!validateRegister()) return;

  try {
    const response = await api.post('/auth/reg', regForm);
    regServerMessage.value = response.data.message || "User registered successfully!";
    isRegSuccess.value = true;

    loginUser(response.data.username, response.data.id);
    Object.keys(regForm).forEach(key => regForm[key] = '');     // Clear form fields on success

    router.push('/');
  } catch (err) {
    if (err.response) {
      const backendError = err.response.data;

      // Check if the backend specifically flagged the username duplicate
      if (backendError === "Username already exists.") {
        regErrors.UserName = "This Username is already taken.";
      } else {
        // Fallback for any other generic backend registration error
        regServerMessage.value = backendError || "Registration failed.";
      }
    } else {
      regServerMessage.value = "Network error. Please try again.";
    }
  }
};
</script>

<template>
  <section id="aa-myaccount">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="aa-myaccount-area">
            <div class="row">
              
              <div class="col-md-6">
                <div class="aa-myaccount-login">
                  <h4>Login</h4>
                  <form @submit.prevent="handleLogin" class="aa-login-form">
                    <label class="txt-lbl">Username or Email address<span>*</span></label>
                    <input v-model="loginForm.UserName" type="text" placeholder="Username":class="{ 'input-error': loginErrors.UserName }">
                    
                    <label class="txt-lbl">Password<span>*</span></label>
                    <input v-model="loginForm.Password" type="password" placeholder="Password":class="{ 'input-error': loginErrors.Password }">
                    
                    <p v-if="loginServerMessage" class="txt-lbl error-msg server-msg">{{ loginServerMessage }}</p>

                    <button type="submit" class="aa-browse-btn">Login</button>
                    <label class="rememberme" for="rememberme">
                      <input v-model="loginForm.RememberMe" type="checkbox" id="rememberme"> Remember me
                    </label>
                    <p class="aa-lost-password"><a href="#">Lost your password?</a></p>
                  </form>
                </div>
              </div>

              <div class="col-md-6">
                <div class="aa-myaccount-register">
                  <h4>Register</h4>
                  <form @submit.prevent="handleRegister" class="aa-login-form">
                    <label class="txt-lbl">First Name<span>*</span></label>
                    <input v-model="regForm.FirstName" type="text" placeholder="Enter first name":class="{ 'input-error': regErrors.FirstName }">

                    <label class="txt-lbl">Last Name<span>*</span></label>
                    <input v-model="regForm.LastName" type="text" placeholder="Enter last name":class="{ 'input-error': regErrors.LastName }">

                    <label class="txt-lbl">Username<span>*</span></label>
                    <input v-model="regForm.UserName" type="text" placeholder="Username":class="{ 'input-error': regErrors.UserName }">

                    <label class="txt-lbl">Password<span>*</span></label>
                    <input v-model="regForm.Password" type="password" placeholder="Password":class="{ 'input-error': regErrors.Password }">

                    <label class="txt-lbl">Email<span>*</span></label>
                    <input v-model="regForm.Email" type="text" placeholder="Enter your email":class="{ 'input-error': regErrors.Email }">

                    <label class="txt-lbl">Mobile<span>*</span></label>
                    <input v-model="regForm.Mobile1" type="text" placeholder="Mobile":class="{ 'input-error': regErrors.Mobile1 }">

                    <label class="txt-lbl">Address</label>
                    <input v-model="regForm.Address1" type="text" placeholder="Address">

                    <p v-if="regServerMessage" :class="['txt-lbl server-msg', isRegSuccess ? 'success-msg' : 'error-msg']">
                      {{ regServerMessage }}
                    </p>

                    <button type="submit" class="aa-browse-btn">Register</button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>