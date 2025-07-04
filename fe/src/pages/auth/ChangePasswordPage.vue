<script setup lang="ts">
  import {ref} from 'vue'
  import { recoverPassSendOTP } from '../../api/userAPI';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const username = ref<string>('');
  const email = ref<string>('');
  const newpassword = ref<string>('');
  const err = ref<string>('');

  const handleRecover = async () =>{
    try {
        await recoverPassSendOTP(username.value, email.value, newpassword.value);
        alert(`Đã gửi OTP đến email ${email.value}`);
        router.push({path:'/changePass/verifyOTP', query: {context:'fogot'}});
    } catch (error:any) {
        if(error.response){
            const status = error.response.status;
            if(status == 400){
                err.value = "Thiếu thông tin đổi mới"
            }
            else if(status == 404){
                err.value = `Không tìm thấy tài khoản ${username.value} với email ${email}`
            }
            else{
                err.value = 'Server không phản hồi!'
            }
        }
    }
  }
  const handleLogin = () =>{
    router.push('/login')
  }
</script>
<template>
  <div class="recover">
    <div class="container">
      <h2>Enter information to recover password</h2>
      <input v-model="username" placeholder="Username"/>
      <input v-model="email" placeholder="Email"/>
      <input v-model="newpassword" placeholder="New password"/>
      <div class="group">
        <button @click="handleLogin">< Cancel</button>
        <button @click="handleRecover">Next ></button>
      </div>
     
    </div>
    <p>{{ err }}</p>
  </div>
</template>
<style scoped>
  .recover{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  .container{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 40%;
    height:45%;
    border-radius: 8px;
    background-color: white;
  }
  input{
    padding: 0.5rem;
    margin: 0.5rem;
    border: 1px solid #ccc;
    border-radius:8px;
    width: 80%;
  }
  button{
    display: inline-block;
    padding: 0.75rem;
    margin: 0.5rem;
    width: 100px;
    border: none;
    border-radius: 8px;
    background-color: rgb(114, 114, 216);
  }
  .group{
    display: flex;
    gap: 6rem
  }
  input:hover{
    background-color: aliceblue;
  }
  button:hover{
    background-color:rgb(79, 79, 168) ;
  }

  p{
    color:red;
    font-size: 15px;
    position: fixed;
    bottom: 96px;
  }

  h2{
    color: blue;
  }

</style>