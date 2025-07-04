<script setup lang="ts">
import {onMounted, ref} from 'vue'
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { UpdateInforMe } from '../../api/userAPI';
const auth = useAuthStore();
const name = ref<string>('');
const password = ref<string>('');
const address = ref<string>('');
const router = useRouter();
const err = ref<string>('');

const handleUpdate = async() =>{
    try {
        await UpdateInforMe(password.value, address.value, name.value, Number(auth.user?.ID))
        alert('Cập nhật thành công');
        router.push('/');
    } catch (error:any) {
        alert('Không thành công');
        console.log(error);
    }
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
        <h2>Cập nhật thông tin </h2>
        <input v-model="name" :placeholder="auth.user?.NAMEUSER"/>
        <input  :placeholder="auth.user?.EMAIL" readonly/>
        <input v-model="address" :placeholder="auth.user?.ADDRESS"/>
        <input  :placeholder="auth.user?.USERNAME" readonly/>
        <input v-model="password" placeholder="Nhập mật khẩu mới"/>
        <button @click="handleUpdate">Cập nhật</button>
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
    background-color: blue;
    border-radius: 8px;
    color: white;
    height: 3.5rem;
  }
  input[readonly] {
    background-color: #f0f0f0;
    cursor: not-allowed;
    }
  button:hover{
    background-color:rgb(8, 8, 190)
  }
  .signin{
    font-size: 15px;
    color: blue;
    cursor: pointer;
  }
</style>