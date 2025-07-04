<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Order } from '../../api/orderAPI';
import { getOrderOfme } from '../../api/orderAPI';
import { useRouter } from 'vue-router';
import { usebookStore } from '../../stores/book';

const router = useRouter();
const bookStore = usebookStore();
const orders = ref<Order[]>([]);
onMounted( async() => {
    const res = await getOrderOfme();
    window.scrollTo({top:35, behavior:'smooth'})
    orders.value = res;
})
</script>
<template>
    <div class="container">
        <div class="infor">    
            <div class="select">
                <p class="history">Lịch sử mua hàng <strong>{{ orders.length }}</strong> sản phẩm</p>
                <div class="Quantity-price">
                    <p>Số lượng</p>
                    <p>Thành tiền</p>
                </div>
            </div>
            <div class="product">
                <div class="empty" v-if="orders.length === 0">
                    <img :src="bookStore.getImg('/upload/book/empty.jpg')" alt="" class="emptyIMg">
                    <p>Chưa có sản phẩm nào trong lịch sử mua hàng của bạn</p>
                    <button class="returnOrder" @click="router.push('/')">Mua sắm ngay</button>
                </div>
                <div class="book-cart" v-for="order in orders" @click="router.push(`/order/${order.ID_BOOK}`)">
                    <div class="img-checkbox">
                        <img :src="bookStore.getImg(order.COVER_IMAGE)" alt="">
                    </div>
                    <div class="detail-price">
                        <p class="infoBooks">{{order.NAMEBOOK}} - {{ order.CATEGORY }} - {{ order.DETAIL.slice(0,60) }}...</p>
                        <div class="price" >
                            <p id="flash">{{ bookStore.getPrice(Number(order.TOTAL_PRICE)/order.QUANTITY)}}</p>
                            <p id="sell">{{ bookStore.getPrice(order.SELL_PRICE) }}</p>
                        </div>
                    </div>
                    <div class="quantitum-totalPrice">
                        <p style="font-weight: bold;">{{ order.QUANTITY }}</p>
                        <p id="total">{{ bookStore.getPrice(Number(order.TOTAL_PRICE)) }}</p>
                    </div>
            </div>
        </div>
    </div>

    </div>
</template>
<style scoped>
.infoBooks{
    text-align: left;
     max-height: 40%;
}
.history{
    margin-left: 12px; 
    font-size: 18px;
}
button{
    background-color: red;
    color: white;
}
button:hover{
    background-color: rgb(204, 6, 6);
    cursor: pointer;
}
.book-cart:hover{
    cursor: pointer;
}
.emptyIMg{
    width: 40%;
    height: 49%;
    /* border-radius: 48%; */
}
.empty{
    background-color: white;
}
input[type="checkbox"]{
    margin-left: 2px;
    width: 15px;
    height: 15px;
    margin-top: 30%;
    margin-left: 10px;
}
#selectAllCart{
margin-top: 0;
}
.input{
    display: flex;
    flex-direction: column;
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

input{
    margin: 4px;
}
#total{
    margin-top: 14px;
    color: rgb(230, 5, 5);
    font-size: 18px;
    font-weight: bold;
}
.price{
    display: flex;
    gap:20px;
    margin-left: 10px;
    justify-content: flex-start;
    z-index: 1000;
}

#sell{
    text-decoration:line-through;
    margin-top: 15px;
    font-size: 14px;
}
#flash{
    margin-top: 10px;
    font-size: 18px;
    font-weight: bold;
}
i{
    margin-top: 20px;
}
.quantitum-totalPrice{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex:1;
    background-color: white;
    padding: 10px;
    width: 14%;
    /* margin-top: 18px; */
    padding-top: 29px;
}
.img-checkbox{
    background-color: white;
    margin-bottom: 2px;
    width: 16%;
    display: flex;
    justify-content: center;
    /* align-items: center; */
}
.detail-price{
    width: 48%;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: start;
    margin-bottom: 2px;
    margin: 0px;
}
label{
    margin-left: 20px;
}
img{
    max-width: 100%;
    max-height: 100%;
}

.book-cart{
    width: 100%;
    height: 120px;
    /* justify-content: space-between; */
    display: flex;
    border: 1px solid #ccc;
    margin-top: 1px;
}
.container{
    width: 96%;
    height: 500px;
    margin-top: 60px;
    display: flex;
    justify-content: center;
}
.infor{
    width: 65%;
    height: 88%;
    padding: 10px;
    margin-left: 20px;
}
.select{
    width: 99%;
    height: 10%;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 200;
    margin-left: 3px;
}
.product{
        box-shadow: 0 8px 8px rgba(0, 0, 0, 0.1);

    width: 99%;
    height: 480px;
    overflow-y: auto;
    overflow-x:hidden;
    scrollbar-width: none;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    padding: 2px;
}
.Quantity-price{
    display: flex;
    gap:150px;
    margin-right: 10px;
}
</style>