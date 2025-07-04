<script setup lang="ts">
  import { ref } from 'vue'
  import { registerVerifyOTP,recoverPassVerifyOTP } from '../../api/userAPI'
  import { useRoute, useRouter } from 'vue-router';

  const router = useRouter();
  const route = useRoute();
  const context = route.query?.context;
  const OTP = ref<number>();
  const err = ref('')
  const handleOTP = async ()=>{
    try {
      const otpNumber = Number(OTP.value);
      if(context === 'register'){
        await registerVerifyOTP(otpNumber);
        alert('Đăng kí thành công');
      }
      else if(context == 'fogot'){
        await recoverPassVerifyOTP(otpNumber);
        alert('Đổi mật khẩu thành công')
      }
      router.push('/login');
    } catch (error: any) {
        console.log(error);
        const errCode = error.response?.data?.errCode;
        if (errCode === 'none-OTP') {
          err.value = 'Vui lòng nhập mã OTP'
        } 
        else if (errCode === 'invalid-OTP') {
          err.value = 'OTP không hợp lệ'
        } 
        else if (errCode === 'expired-OTP') {
          err.value = 'OTP đã hết hạn'
        } 
        else {
          err.value = 'Lỗi không xác định'
        }
    }
  }
  
</script>
<template>
  <body>
    <div class="container">
      <h2>Verify OTP</h2>
      <input v-model="OTP" placeholder="OTP"/>
      <button @click="handleOTP">Verify</button>
      <p> {{err}} </p>
    </div>
  </body>
    
</template>
<style scoped>
  
  .container{
    display: flex;
    flex-direction: column;
    align-items:center;
    width: 30%;
    height:260px;
    border:none;
    border-radius:8px;
    background-color: white;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
;
  }
  body{
    display: flex;
    flex-direction: column;
    justify-content:center;
    align-items:center;
    height:100vh;
  }
  h2{
    color: #2980b9;
  }
  input{
    padding: 1rem;
    margin: 0.75rem;
    width: 80%;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f5f7fa;
  }
  input:hover{
    background-color: white;
  }
  p{
    color: red;
  }
  button{
    padding: 8px;
    margin: 0.75rem;
    width: 85%;
    border: none;
    border-radius: 8px;
    background-color: #2980b9;
  }
  button:hover{
    background-color: #215a80;
  }
</style>