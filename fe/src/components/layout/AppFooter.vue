<script setup lang="ts">
import { ref } from 'vue';
import { sendMail } from '../../api/orderAPI';

const email = ref<string>('');
const handleRegister = async()=> {
  try {
      await sendMail(String(email.value));
      alert('Thành công');
  } catch (error) {
    alert('Thất bại')
  }
}
</script>
<template>
<footer>
      <div class="register-news">
        <p id="title"><i class="fa-solid fa-envelope"></i> ĐĂNG KÝ NHẬN BẢN TIN</p>
        <div class="base">
            <input type="text" v-model="email" placeholder="Nhập địa chỉ Email của bạn">
            <button class="register" @click="handleRegister">Đăng ký</button>
        </div>
      </div>  
      <div class="container-footer">
        <div class="footer-section">
          <h2>📚 HBBOOK</h2>
          <p>Đặt sách liền tay - kiến thức trao ngay</p>
        </div>
        <div class="footer-section">
          <h4>Về chúng tôi</h4>
          <p><i class="fa-solid fa-lock"></i> Chính sách bảo mật</p>
          <p><i class="fa-solid fa-globe"></i> Hoạt động 24/7</p>
        </div>
        <div class="footer-section">
          <h4>Liên hệ</h4>
          <p><i class="fa-solid fa-envelope"></i> 4901104037@hcmue.edu.vn</p>
          <p><i class="fa-solid fa-phone"></i> +84 782 712 842</p>
        </div>
        <div class="footer-section">
          <h4>Theo dõi</h4>
          <div class="icon">
            <a href="https://www.facebook.com/hoanggvanhai"><i class="fab fa-facebook-square"></i></a>
            <a href="https://github.com/HoangVanHaii"><i class="fa-brands fa-github"></i></a>
            <a href="https://www.instagram.com/_hvhai/"><i class="fab fa-instagram"></i></a>
            <a href="https://www.youtube.com/@haihoang2198"><i class="fa-brands fa-youtube"></i></a>
          </div>
        </div>
      </div>
    </footer>
</template>
<style scoped>
.base{
    background-color: white;
    width: 45%;
    display: flex;
    justify-content: space-between;
    padding: 4px;
    border-radius: 6px;

}
input{
    width: 75%;
    border: none;
    outline: none;
    border-radius: 6px;
    padding-left: 4px;
}
h2{
    color: rgb(207, 6, 6);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
button{
    background-color: orange;
    border-radius: 6px;
    color: white;
    outline: none;
}
#title{
    color: white;
    font-size: 20px;
    margin-top: 14px;
}
.register-news{
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(170, 167, 167);
    height: 65px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    gap:10px;
    margin-bottom: 10px;
    margin-top: 30px;
}
p{
    margin-top: 0px;
}
.container-footer{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 20px 10px; 
  background-color: rgb(226, 253, 237);
}
.footer-section{
  display: flex;
  flex-direction: column;
  /* justify-content: flex-start; */
  margin: 10px;
}
.icon{
  font-size: 30px;
  display: flex;
  gap:12px
}
#tabPage{
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  border-radius: 12px;
  background-color: white;
  margin-bottom: 10px;
}
a {
  text-decoration: none;
  color: black;
  cursor: pointer;
  margin-right: 10px;
}

</style>