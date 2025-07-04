<script setup lang="ts">
import { getBookById } from '../../api/bookApi';
import { useAuthStore } from '../../stores/auth';
import { usebookStore } from '../../stores/book';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import type { Book } from '../../api/bookApi';
import { createBorrow } from '../../api/borrowAPI';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const bookStore = usebookStore();
const bookBorrow = ref<Book | null>(null);
onMounted(async () =>{
    const id = route.params.id;
    bookBorrow.value = await getBookById(Number(id));
})
const handleBorrow = async ()=>{
    let books:number[] = [];
    books.push(Number(route.params.id));
    try {
        await createBorrow(books);
        alert('Mượn sách thành công');
        router.push('/')
    } catch (error:any) {
        alert("Không thể mượn sách")
    }
}
</script>
<template>
    <div class="container">

        <div class="pay">
             <div class="infor">    
                <img :src="bookStore.getImg(bookBorrow?.COVER_IMAGE ||'')" alt="">
                <p class="information"><strong>{{ bookBorrow?.NAMEBOOK }}</strong> - {{ bookBorrow?.DETAIL }}
                    <br>-Thể loại: <strong>{{ bookBorrow?.CATEGORY }}</strong>
                    <br>-Tác giả: <strong>{{ bookBorrow?.AUTHOR }}</strong></p>
            </div>
            <hr style="margin-top: 10px; border: 1px solid #ccc;">
            <div class="input">
                <span style="margin-top: 10px;">Tên người nhận</span>
                <input type="text" :placeholder="auth.user?.NAMEUSER" readonly>
                <span>Email nhận hóa đơn</span>
                <input type="text" :placeholder="auth.user?.EMAIL" readonly>
                <span>Địa chỉ nhận hàng</span>
                <input  type="text" :placeholder="auth.user?.ADDRESS" readonly >
                <span  style="color: red;">* Lưu ý</span>
                <input type="text" readonly placeholder="Sau 7 ngày không hoàn trả thì sẽ tính phí thêm 2000đ/ngày">
            </div>
            <hr>
            <!-- <input type="text" name="" id=""> -->
            <div class="tmpTotal">
                <p style="">Thành tiền</p>
                <p>{{ bookStore.getPrice(bookBorrow?.BORROW_PRICE || 0) }} / 01 tuần</p>
            </div>
            <hr>
            <div class="tmpTotal">
                <p style="font-weight:600;">Tổng số tiền (gồm VAT)</p>
                <p style="font-size: 22px; font-weight: 700;color: red;">{{ bookStore.getPrice(bookBorrow?.BORROW_PRICE || 0) }} </p>
            </div>
            <button @click="handleBorrow" >Mượn sách</button>
        </div>
    </div>
</template>
<style scoped>
.information{
    margin-top: 20px;
    text-align: left;
    margin-left: 4px;
}
.infor{
    width: 99%;
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.input{
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* align-items: center; */
    padding: auto;
    margin-left: 40px;
    padding: 10px;
}
input:hover{
    background-color: rgb(252, 249, 249);
}
textarea{
    padding: 4px;
    margin-left: 5px;
    width: 84%;
    height: 100px;
    resize: none;
    /* max-height: 30%; */
    border: 1px solid #ccc;
    border-radius: 12px;
}
input{
    padding: 10px;
    width: 82%;
    border-radius: 10px;
    border:1px solid #ccc;
}
span{
    margin-left: 10px;
    font-size: 13px;
    text-align: left;
}
.none{
    width: 100%;
    height: 40%;
}
button{
    margin: 8px;
    background-color: rgb(218, 7, 7);
    color: white;
    font-weight: 600;
    /* font-family:; */
}
hr{
    border-top: 2px solid black;
    margin: 0px 0;
    margin-bottom: 10px;
    margin-left: 20px;
    width: 92%;
    /* margin-right: 10px; */
}
.tmpTotal{
    display: flex;
    width: 95%;
    background-color: white;
    justify-content: space-between;
    align-items: center;
    /* flex: 1; */
    padding-left: 12px;
    padding-right: 2px;
    height: 8%;
    border-radius: 12px;
}
.pay{
    width: 40%;
    height: auto;
    background-color: white;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    box-shadow: 0 8px 8px rgba(0, 0, 0, 0.1);
    /* background-color: #ccc; */
}
input{
    margin: 4px;
}
#total{
    margin-top: 14px;
    color: rgb(230, 5, 5);
    font-size: 18px;
}
.price{
    display: flex;
    gap:20px;
    margin-left: 10px;
    justify-content: flex-start;
    z-index: 1000;
}
img{
    margin: 4px;
    border-radius: 12px;
    margin-left: 15px;
    max-width: 170px;
    max-height: 130px;
}
i{
    margin-top: 20px;
}
.container{
    width: 96%;
    height: auto;
    margin-top: 70px;
    display: flex;
    justify-content: center;
}

</style>