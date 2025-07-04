<script setup lang="ts">
    import { ref } from 'vue'
    import { login } from '../../api/userAPI'
    import { useRouter, useRoute } from 'vue-router';

    const emit = defineEmits(['loggedIn']);

    const username = ref('');
    const password = ref('');
    const err = ref('')
    const router = useRouter();
    const route = useRoute();

    const handleClick = async () => {
       try {
          const result = await login(username.value, password.value);
          localStorage.setItem('accessToken',result.token);
          localStorage.setItem('refreshToken',result.refreshToken);
          alert('Đăng nhập thành công');
          emit('loggedIn');
          router.push ('/')
       }
      catch (error: any) {
          if(error.response){
            const status = error.response.status;
            console.log(status);
            if(status == 401){
              err.value = 'Tên đăng nhập hoặc mật khẩu không đúng'
            }
            else if(status == 400){
              err.value = 'Vui lòng nhập đầy đủ thông tin'
            }
            else{
              err.value = 'Lỗi kết nối tới server'
            }
          }
       }
    }
    const handleSignup = () => {
      router.push('/register/sendOTP');
    }
    const handleRecover = () => {
      router.push('/changePass/sendOTP');
    }
</script>
<template>
    <body >
      <div class="login" v-if="route.path === '/login'">
        <h2>Đăng nhập vào HBBOOK</h2>
        <input v-model="username" placeholder="Email hoặc Tên đăng nhập"/>
        <input v-model="password" placeholder="Mật khẩu" type="password"/>
        <button @click="handleClick">Đăng nhập</button>
        <p @click="handleRecover">Quên mật khẩu?</p>
        <button class="register" @click="handleSignup">Tạo tài khoản mới</button>
      </div>
      <p v-if="err" class="err">{{ err }}</p>
    </body>
</template>
<style scoped>
  .login{
    background-color: white;
    padding: 2rem;
    border-radius: 12px;
    width: 325px;
    height: auto;
  }
  p{
    color: #2980b9;
    cursor: pointer;
  }
  body {
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
    height: 100vh;
    display: flex;
    justify-content: center;
  }
  h2{
    margin-bottom: 1.5rem;
    color: rgb(228, 8, 8);
  }

  input{
    display: block;
    width: 94%;
    margin-bottom: 1rem;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
  }
  input:hover{
    background-color:aliceblue
  }
  button:focus{
    cursor: progress;
  }
  .err{
    position: fixed;
    bottom:70px;
    font-size: 14px;
    color: red;
  }
  .register{
    width: 60%;
    background-color: rgb(83, 136, 4);
    margin-top: -6px;
  }
  button{
    padding: 0.75rem;
    width: 100%;
    background-color: rgb(219, 4, 4);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  button:hover{
    background-color:rgb(185, 6, 6);
  }
  .register:hover{
    background-color: rgb(3, 100, 3);
  }

</style>