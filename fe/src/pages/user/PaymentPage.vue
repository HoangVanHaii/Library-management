<script setup lang="ts">
import { getBookById } from '../../api/bookApi';
import { useAuthStore } from '../../stores/auth';
import { usebookStore } from '../../stores/book';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import type { Book } from '../../api/bookApi';
import { createOrder } from '../../api/orderAPI';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const bookStore = usebookStore();
const bookOrder = ref<Book | null>(null);
const totalPrice = ref<number>(0);

onMounted(async () => {
    const id = route.query.book_id;
    const quantity:number = Number(route.query.quantity);
    console.log(id, quantity);
    bookOrder.value = await getBookById(Number(id));
    if(bookOrder.value && quantity){
        totalPrice.value += (bookOrder.value?.FLASH_PRICE * quantity)
        console.log(bookOrder.value);
    }
})
const handleOrder = async() => {
    try {
        const id_book = route.query.book_id ;
        const quantity = route.query.quantity;
        if(bookOrder.value && quantity){
            await createOrder(Number(id_book), Number(quantity), 0, (bookOrder.value?.FLASH_PRICE * Number(quantity)));
        }
        alert('Đặt sách thành công');
        router.push(`/order/${id_book}`);
    } catch (error:any) {
        const status = error.response.status
        if(status == 400){
            alert('Sản phẩm hiện đã hết hàng')
        }
        else alert('Không thể đặt hàng')   
    }
}
</script>
<template>
    <div class="container">

        <div class="pay">
             <div class="infor">    
                <img :src="bookStore.getImg(bookOrder?.COVER_IMAGE ||'')" alt="">
                <p class="information"><strong>{{ bookOrder?.NAMEBOOK }}</strong> - {{ bookOrder?.DETAIL }}
                    <br>-Thể loại: <strong>{{ bookOrder?.CATEGORY }}</strong>
                    <br>-Tác giả: <strong>{{ bookOrder?.AUTHOR }}</strong></p>
            </div>
            <hr style="margin-top: 10px; border: 1px solid #ccc;">
            <div class="input">
                <span style="margin-top: 10px;">Tên người nhận</span>
                <input type="text" :placeholder="auth.user?.NAMEUSER" readonly>
                <span>Email nhận hóa đơn</span>
                <input type="text" :placeholder="auth.user?.EMAIL" readonly>
                <span>Địa chỉ nhận hàng</span>
                <input  type="text" :placeholder="auth.user?.ADDRESS" readonly >
                <span>Ghi chú</span>
                <textarea placeholder="Để lại ghi chú cho người bán"></textarea>
            </div>
            <hr>
            <!-- <input type="text" name="" id=""> -->
            <div class="tmpTotal">
                <p style="">Thành tiền</p>
                <p>{{ bookStore.getPrice(totalPrice) }}</p>
            </div>
            <hr>
            <div class="tmpTotal">
                <p style="font-weight:600;">Tổng số tiền (gồm VAT)</p>
                <p style="font-size: 22px; font-weight: 700;color: red;">{{ bookStore.getPrice(totalPrice) }}</p>
            </div>
            <button @click="handleOrder" :disabled="totalPrice==0">Đặt hàng</button>
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
input[type="checkbox"]{
    margin-left: 2px;
    width: 15px;
    height: 15px;
    margin-top: 30%;
    margin-left: 10px;
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
    width: 80%;
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