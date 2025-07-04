<script setup lang="ts">
    import { useAuthStore } from '../stores/auth';
    import { computed, ref } from 'vue';
    import { uploadIMGtoDb } from '../api/userAPI';
    import { changeAvatar } from '../api/userAPI';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const changeAvt = ref<boolean>(false)
    const auth = useAuthStore();
    computed(() => {
      // auth.closeform();
    })
    const handleChoseFile =async (event:Event) => {
        console.log(auth.user?.COVER_IMAGE);
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if(file && (file.type == 'image/jpeg' || file.type == 'image/png')){
          const formData = new FormData();
          formData.append('image', file);
          try {
            const path = await uploadIMGtoDb(formData);
                await changeAvatar(`/upload/user/${path.file}`);
                console.log("tr",auth.user?.COVER_IMAGE)
                await auth.fetchInfor();
                console.log("sau",auth.user?.COVER_IMAGE)
                // router.push('/');
            } catch (error) {
                alert('Lỗi server');
            }          
        }
    }
    const handleGetOrder = () => {
      auth.show = false;
      router.push('/order/me')
    }
</script>

<template>
    <div class="info-form">
    <div class="avata">
      <a class="me" :href="auth.getImg(auth.user?.COVER_IMAGE||'')"><img  :src="auth.getImg(auth.user?.COVER_IMAGE||'')"  alt="noneimg" id="me"></a>
      <div class="info">
        <p> <strong>{{ auth.user?.NAMEUSER }}</strong></p>
        <p class="email">{{ auth.user?.EMAIL }}</p>
        <p class="role"><i class="fa-solid fa-check"></i>{{ auth.user?.ROLE.toLowerCase() }}</p>
      </div>
    </div >
    <div class="orther">
      <a @click="auth.show = false;router.push('/updateProfile')"><i class="fa-solid fa-key"></i>Cập nhật thông tin<br></a>
      <a @click="changeAvt = !changeAvt"><i class="fa-regular fa-images"></i>Đổi ảnh đại diện </a>
      <input type="file" v-if="changeAvt" @change="handleChoseFile"><br>
      <a @click="handleGetOrder"> <i class="fa-solid fa-cart-shopping"></i>Đơn hàng của bạn <br></a>
      <a @click="auth.handleLogout()"><i class="fa-solid fa-arrow-right-from-bracket"></i>Đăng xuất</a>
    </div>
    <button @click="auth.closeform()" class="btn-close">close</button>
  </div>
</template>
<style scoped>

.info-form {
  position: absolute;
  width: 300px;
  height: 310px;
  top: 128px; 
  right: 15px;
  background-color: white;
  color: black;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color:#e9e8e6;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
}
.email{
  font-size: 14px;
  color:cadetblue;
}
p{
  text-align: left;
  margin-left:7px ;
  margin-bottom: -14px;
}
.orther {
  text-align: left;
  margin-top: 20px;
}
.role{
  font-size: 14px;
  color:green;
  margin-left: -2px;
}
#me{
  width: 97%;
  height: 89%;
  margin: 4px;
  border-radius: 49%;
}
.avata{
  border: none;
  display: flex;
  border-radius: 8px;
  background-color: white;
  width: 100%;
  height: 30%;
}
a{
  cursor: pointer;
  color: black;
}
a:hover{
  border-radius: 5px;
  padding: 3px;
  background-color: #d6d5d4;
}
.me{
  width: 30%;
}
.me:hover{
  border-radius: 8px;
  padding: 0px;
  background-color: white;
}
i{
  margin: 10px;
}
.btn-close{
  position: absolute;
  left:37%;
  bottom: 12px;
}

</style>