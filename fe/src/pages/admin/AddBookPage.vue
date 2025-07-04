<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { uploadFileToDb } from '../../api/uploadAPI';
import { addbook } from '../../api/bookApi';
import { updateBookById } from '../../api/bookApi';

const route = useRoute();
const path = ref<string>('');
const name = ref<string>('');
const auth = ref<string>('');
const detail = ref<string>('')
const category = ref<string>(''); 
const quantity = ref<number >();
const sell_price = ref<number>();
const flash_price = ref<number >();
const router = useRouter();
const selectFile = ref<File | null>(null);

// onMounted(() => {
//   console.log(route.params.id);
// })

const handleFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
    selectFile.value = file;
    path.value = URL.createObjectURL(file);
  }
};
const UploadFile = async() => {
  if(selectFile.value){
    const formData = new FormData();
    formData.append('image', selectFile.value);
    const res = await uploadFileToDb(formData)
    return  `/upload/book/${res.file}`;
  }
  
}
const handleAdd = async () => {
  let pathFile= await UploadFile();

  try {
    await addbook(name.value, auth.value, category.value, String(pathFile)  , Number(quantity.value ?? 0), Number(sell_price.value ?? 0), Number(flash_price.value ?? 0), detail.value);
    alert("Thêm sách thành công");
    router.push('/');
  } catch (error: any) {
    if(error.response){
      const status = error.response.status;
      if(status === 400){
        alert('Vui lòng điền đầy đủ thông tin');
      }
      else {
        alert("Không thể thêm sách");
      }
    }
  }
};
const handleUpdate = async () => {
  let pathFile = await UploadFile() || null;
  alert(pathFile)
  try {
    await updateBookById(name.value, auth.value, category.value, pathFile || '', Number(quantity.value), Number(sell_price.value), Number(flash_price.value), detail.value, Number(route.params.id))
    alert('Cập nhật thành công');
    router.push('/admin/book');
  } catch (error:any) {
    alert("Không thể cập nhật");
  }
}
</script>

<template>
  <header>
  </header>
  <div class="container">
      <div class="form-box">
          <div class="preview-box">
            <img :src="path" alt="Image preview" v-if="path" />
            <span v-else class="placeholder" style="margin-top: 160px;">No image selected</span>
            <input type="file" accept=".jpg,.png" @change="handleFile" />
          </div>

          <div class="form-inputs">
            <input v-model="name" type="text" placeholder="Tên sách" />
            <input v-model="auth" type="text" placeholder="Tác giả" />
            <input v-model="category" type="text" placeholder="Thể loại" />
            <input v-model="quantity" type="number" placeholder="Số lượng" />
            <input v-model="sell_price" type="number" placeholder="Giá bán" />
            <input v-model="flash_price" type="number" placeholder="Giá sale">
            <textarea v-model="detail"  placeholder="Mô tả sản phẩm"></textarea>
          <div class="buttons">
            <button class="cancel" @click="router.push('/')">Hủy bỏ</button>
            <button class="create" @click="handleAdd" v-if="route.path === '/admin/book/addbook'">Tạo mới</button>
            <button class="create" @click="handleUpdate" v-else>Cập nhật</button>
          </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-top: 130px;
  flex-direction: column;
}

/* margin-top: -100px; */
.form-box {
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 800px;
  gap: 30px;
  margin-top: -100px;
}

.preview-box {
  margin-top: 0px;
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f9fafb;
  border-radius: 12px;
  border: 1px dashed #d1d5db;
}

.preview-box img {
  max-width: 100%;
  max-height: 290px;
  object-fit: contain;
  border-radius: 10px;
  /* height: 100; */
}

.placeholder {
  color: #9ca3af;
  font-style: italic;
}

.form-inputs {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  gap: 16px;
}
.form-title {
  font-size: 80px;
  font-weight: 600;
  text-align: center;
  margin-top :-60px;
  color: white;
  padding-bottom: 20px;
}
textarea,
input[type="number"],
input[type="text"]{
  padding: 10px 15px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 16px;
  background-color: #f9fafb;
  outline: none;
  transition: all 0.3s ease;
}
textarea{
  width: 90%;
  height: 20px;
  max-width: 410px;
  /* max-width: 80%; */
  max-height: 60px;
}
input[type="number"]:focus{
  border-color: #6366f1;
  background-color: #fff;
}
input[type="text"]:focus {
  border-color: #6366f1;
  background-color: #fff;
}

input[type="file"] {
  cursor: pointer;
    margin: auto;
  margin-bottom: 10px;
  margin-left: 70px;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}

button {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: none;
}

.create {
  background-color: #4f46e5;
  color: white;
}

.create:hover {
  background-color: #4338ca;
}

.cancel {
  background-color: #e5e7eb;
  color: #374151;
}

.cancel:hover {
  background-color: #d1d5db;
}
</style>
