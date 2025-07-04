<script setup lang="ts">
import UserInfor from '../UserInfor.vue';
import { useAuthStore } from '../../stores/auth';
import { onMounted, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCartStore } from '../../stores/cart';

const cartStore = useCartStore();
const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const wrapper = ref<HTMLElement| null>(null);
const wrapperForm = ref<HTMLElement | null>(null);
const word = ref<string>('');
const type = ref<string>('Name');
onMounted( async () => {
    // console.log(route.query.word)
    word.value = String(route.query.word || '');
    cartStore.fetchCart();
    console.log(auth.isLoggedIn);
    document.addEventListener('click', clickOutside)
})

watch(() => route.query.word, (newWord) => {
    word.value = newWord ? String(newWord) : '';}
);

// const handleShow = () => authshow = !show.value;
const clickOutside = (event: MouseEvent) => {
    if(wrapper.value && !wrapper.value.contains(event.target as Node)) {
        auth.show = false;
    }
    if(wrapperForm.value && !wrapperForm.value.contains(event.target as Node)) {
        auth.show = false;
    }
}
const handlelogin = () => {
    auth.show = false;
    router.push('/login');
}
const handleregister = () => {
    auth.show = false;
    router.push('/register/sendOTP')
}


const handleSearch = () =>{
    router.push({path:'/search', query:{
        word: word.value,
        type: type.value
    }})
}
</script>
<template>
    <header>
        <div class="title">
            <p class="HB">CỔNG KẾT NỐI TRI THỨC CỦA BẠN</p>
        </div>
        <div class="content">
            <p id="HB">📚 HBBOOK.com</p>
            <div class="groupFindBook">
            <div class="search">
                <input v-model="word" type="text" id="searchIpn" placeholder="Search book" @keyup.enter="handleSearch">
                <i class="fa-solid fa-magnifying-glass" id="find" @click="handleSearch"></i>
            </div>
            <div class="select">
                <select v-model="type">
                <option>Name</option>
                <option >Category</option>
                <option >Author</option>
                </select>
            </div>
            </div>
            <div class="infor">
                <p class="btn" ><i class="fa-regular fa-bell"></i><br>Thông báo</p>
                <div class="icon-quantity" @click="router.push('/order/shoppingCart')">
                    <div class="small">
                        <i class="fa-solid fa-cart-shopping cart-icon"></i>
                        <strong  class="quantity" v-if="cartStore.quantityCart != 0 && auth.isLoggedIn">{{ cartStore.quantityCart }}</strong>
                    </div>
                <p class="cartShop" @click="router.push('/order/shoppingCart')">Giỏ hàng</p>
                </div>
                <p class="btn"  @click.stop="auth.showform"><i class="fa-regular fa-user"></i><br> Tài khoản</p>   
            </div>
        </div>
        <div class="signin-signout" v-if="auth.show && !auth.isLoggedIn" ref="wrapperForm">
            <button class="login" @click="handlelogin">Đăng nhập</button>
            <button class="register" @click="handleregister">Đăng ký</button>
        </div>
        <div v-if="auth.show && auth.isLoggedIn" ref="wrapper" >
            <UserInfor />
        </div>
    </header>
    
</template>
<style scoped>


.cartShop{
    margin-top: 5px;
    font-size: 15px;
    margin-top: 2px;
}
.quantity{
  font-size: 12px;
  margin-top: -3px;
  color: red;
  border-radius: 40%;
}
.small{
    margin-top: 4px;
    display: flex;
    margin-left: 16px;
}
.cart-icon{
    margin-top: 9px;
}
span{
    margin-top: -20px;
}
.icon-quantity{
    margin-left: 15px;
}
.icon-quantity:hover{
    cursor: pointer;
}
#find{
    background-color: rgb(187, 7, 7);
    width: 12%;
    padding: 10px;
    border-radius: 12px;
    margin: 4px;
    color: white;
}
#find:hover{
    cursor: pointer;
}
select{
    width: 90%;
    outline: none;
    border: none;
    height: 90%;
    border-radius: 10px;
}
input{
  width: 80%;
  border-radius: 10px;
  border: none;
  outline: none;  
  padding-left: 9px;
}
.groupFindBook{
  width: 45%;
  display: flex;
  gap:25px;
  /* z-index: 999; */
}
.search{
  display: flex;
  flex-direction: row;
  background-color: white;
  margin-top: 8px;
  width: 70%;
  height: 40px;
  border-radius: 12px;
  border:1px solid #ccc;
}
.select{
  margin-top: 8px;
  height: 40px;
  border:none;
  border-radius:10px;
  width: 20%;
  background-color: white;
  border:1px solid #ccc;
}
.login{
    background-color: rgb(226, 3, 3);
    color: white;
}
.login:hover{
    background-color: rgb(207, 3, 3);
}
.register{
    background-color: white;
    border: 1px solid rgb(226, 3, 3);
    color: rgb(226, 3, 3);
}
.register:hover{
    background-color: rgb(247, 241, 241);
}
.signin-signout{
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 12px;
    position: fixed;
    top: 15.3vh;
    right: 10px;
    width: 20%;
    padding: 10px;
    margin-top: 1px;
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);

}
button{
margin-top: 10px;
}
.btn{
    background-color: white;
    width: 34%;
    height: 20px;
    margin-top: 8px;
    cursor: pointer;
    font-size: 15px;
}
.infor{
    display: flex;
    width: 20%;
    justify-content: space-between;
}
.title{
    height: 65px;
    background-color: rgb(226, 27, 27);
    display: flex;
    justify-content: center;
    align-items: center;
}
.HB{
    margin-top: 56px;
    font-size: 30px;
    color: white;
    font-family: "Arial Black", Impact, "Comic Sans MS", sans-serif;
}
#HB{
    margin-top: 0px;
    color: rgb(206, 8, 8);
    font-size: 26px;
    margin-top: 8px;
    margin-left: 20px;
    font-family: "Arial Black", Impact, "Comic Sans MS", sans-serif;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);


}
.content{
    display: flex;
    height: 60px;
    border: none;
    background-color: white;
    justify-content: space-between;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

}
header {
  position: fixed;
  width: 100%;     
  top: 0;
  padding: 0;
  background-color: rgb(206, 29, 29);
  margin-left: -30px;
  z-index: 1000;
  border: none;
  border-radius: 10px;
  height: 11vh;
  margin-top: -24px;
  background-color: white;
  display: flex;
  flex-direction: column;
}

</style>