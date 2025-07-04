<script setup lang="ts">
import {  onMounted } from 'vue'
import { useRoute } from 'vue-router'
import '@fortawesome/fontawesome-free/css/all.css'
import { useAuthStore } from './stores/auth'
import GetBorrowPage from './pages/user/GetBorrowPage.vue'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'

const auth = useAuthStore();
const route = useRoute()

onMounted(async ()=> {
   await auth.fetchInfor();
})
const handlelogged = async ()=>{
   auth.fetchInfor();
}
</script>
<template>
  <AppHeader />
  <div class="app">
    <nav class="main-nav" v-if="route.path !=='/login' && route.path !== '/register/sendOTP' && route.path !== '/register/verifyOTP'"> 
        <router-link to="/"><i class="fa-solid fa-house-laptop"></i> Trang chủ</router-link>
        <router-link to="/books"><i class="fa-solid fa-basket-shopping"></i> Cửa hàng </router-link>
        <router-link to="/borrows"><i class="fa-solid fa-book"></i> Thư viện </router-link>
        <router-link to="/contacs"><i class="fa-solid fa-phone"></i> Liên hệ</router-link>
        <router-link to="/about"><i class="fa-regular fa-address-card"></i> Giới thiệu</router-link>
    </nav>
    <router-view @loggedIn="handlelogged" />
    <GetBorrowPage />
    <AppFooter v-if="route.path === '/' || route.path === '/admin/book' || route.path === '/books' || route.path === '/borrows'"/>
  </div>
  <div>
  </div>
</template>
<style scoped>
.main-nav {
  display: flex;
  justify-content: center;
  gap: 30px;
  border-bottom: 2px solid #e0e0e0;
  font-family: 'Segoe UI', sans-serif;
  font-size: 16px;
  font-weight: 500;
  width: 55%;
  margin: auto;
  position: static;
  margin-top: 80px;
}
.main-nav a {
  text-decoration: none;
  color: #333;
  position: relative;
  padding: 6px 4px;
  transition: all 0.3s ease;
}
.main-nav a:hover {
  color: #d60000;
}
.main-nav a::after{
    color: #d60000;
}
.router-link-exact-active {
  font-weight: bold;
  color: #d60000 !important;
}
.app {
  width: 100%;
  height: 100%;
  position: relative;
}

</style>
