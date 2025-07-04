<script setup lang="ts">
    import {onMounted, ref} from 'vue'
    import { registerSendOTP } from '../../api/userAPI';
    import { useRouter } from 'vue-router';

    const name = ref<string>('');
    const email = ref<string>('');
    const username = ref<string>('');
    const password = ref<string>('');
    const address = ref<string>('');
    const router = useRouter();
    const err = ref<string>('');

    const handleSendOTP = async() =>{
        try {
          await registerSendOTP(name.value, email.value, username.value, password.value, address.value);
          alert(`Đã gửi OTP đến email ${email.value}`);
          router.push({path:'/register/verifyOTP', query: {context:'register'}})
        } catch (error: any) {
          if(error.response){
            const status = error.response.status;
            if(status == 400){
              err.value = "Chưa đủ thông tin đăng kí";
            }
            else {
              err.value = "Đăng kí thất bại";
            }
          }
        }
    }
    const handleSignin = () =>{
      router.push('/login');
    }
    onMounted(() =>{
      window.scrollTo({
        top:0,
        behavior:'smooth'
      })
    })
</script>
<template>
  <body>
    <div class="signup">
        <h2>Đăng ký tài khoản </h2>
        <input v-model="name" placeholder="Họ và Tên"/>
        <input v-model="email" placeholder="Email"/>
        <input v-model="address" placeholder="Địa chỉ"/>
        <input v-model="username" placeholder="Tên đăng nhập"/>
        <input v-model="password" placeholder="Mật khẩu"/>
        <button @click="handleSendOTP">Đăng ký</button>
        <p class="signin" @click="handleSignin">Bạn đã có tài khoản?</p>
      </div>
      <p v-if="err" class="error">{{ err }}</p>
  </body>
</template>
<style scoped>
  .error{
    position: fixed;
    color: red;
    bottom: 30px;
  }
  .signup{
    display: flex;
    flex-direction:column;
    align-items: center;
    border: none;
    width: 40%;
    height: 480px;
    background-color: white;
    border-radius: 8px;
  }
  h2{
    margin: 1.5rem;
    color: rgb(216, 3, 3);
  }
  body{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  input{
    padding: 0.75rem;
    margin-bottom: 0.75rem;
    width: 80%;
    height: 30px;
    border:1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
  }
  input:hover{
    background-color:beige
  }
  button{
    padding: 4px;
    margin: 5px;
    width: 85%;
    height: 45px;
    border:none;
    cursor:pointer;
    font-size: 1rem;
    background-color: rgb(201, 5, 5);
    border-radius: 8px;
    color: white;
    height: 3.5rem;
  }
  button:hover{
    background-color: rgb(173, 5, 5);
  }
  .signin{
    font-size: 15px;
    color: blue;
    cursor: pointer;
  }
</style>