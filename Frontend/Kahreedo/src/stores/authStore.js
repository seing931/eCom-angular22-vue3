import { ref } from 'vue';

// Reactive global states
export const userName = ref(localStorage.getItem('userName') || '');
export const customerId = ref(localStorage.getItem('customerId') || null); // Javascript only allow Id not ID
export const isAuthenticated = ref(!!localStorage.getItem('userName'));

// Pass both username and id when calling loginUser from your Login component
export const loginUser = (username, id) => {
  userName.value = username;
  customerId.value = id;
  isAuthenticated.value = true;
  
  localStorage.setItem('userName', username);
  localStorage.setItem('customerId', id.toString()); // Persist ID
};

export const logoutUser = () => {
  userName.value = '';
  customerId.value = null;
  isAuthenticated.value = false;
  
  localStorage.removeItem('userName');
  localStorage.removeItem('customerId'); // Clean up ID
};
