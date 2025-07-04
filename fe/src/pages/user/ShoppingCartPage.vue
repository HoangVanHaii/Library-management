<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { usebookStore } from '../../stores/book';
import { useAuthStore } from '../../stores/auth';
import { createOrder } from '../../api/orderAPI';
import { useRouter } from 'vue-router';
import { deleteCartShopping } from '../../api/cartAPI';
import { useCartStore } from '../../stores/cart';
import type { Cart } from '../../api/cartAPI';

const cartStore = useCartStore();
const router = useRouter();
const bookStore = usebookStore();
const auth = useAuthStore();
const selectAll = ref<boolean>(false)
const selected = ref<boolean[]>([]);
const cartsChose = ref<Cart[]>([]);
const totalPrice = ref<number>(0)
onMounted( async() => {
    window.scrollTo({
        top:35,
        behavior:'smooth'
    })
    await cartStore.fetchCart();
    selectAll.value = false;
    console.log(cartStore.carts.length);

    selected.value = cartStore.carts.map(() => false);

    console.log(selected.value.length);
    console.log('cart', cartStore.carts);
    
})
watch(selectAll, (checked) => {
    for(let i = 0 ; i < selected.value.length; i++){
        selected.value[i] = checked;
    }
})
watch(selected, async(val) => {
    let allChecked = true;
    for(let i = 0 ;i < val.length ; i++){
        if(!val[i]){
            allChecked = false;
            // console.log(carts.value[i]);
            break;
        }
    }
    selectAll.value = allChecked;
    cartsChose.value = cartStore.carts.filter((_:any,index:any) => selected.value[index])
    Price();
    console.log(cartsChose.value);
}, {deep:true})
const Price = () => {
    totalPrice.value = cartsChose.value.reduce((sum, cart) => {
        return sum + cart.FLASH_PRICE*cart.QUANTITY
    },0)
}
const handleOrder = async () => {
    try {
        
        for(let i = 0; i < cartStore.carts.length ; i++){
            if(selected.value[i]){
                await createOrder(Number(cartStore.carts[i].ID_BOOK), 
                    Number(cartStore.carts[i].QUANTITY), 
                    Number(cartStore.carts[i].ID_CART), 
                    Number(cartStore.carts[i].FLASH_PRICE * cartStore.carts[i].QUANTITY) );
            }
        }
        alert('đặt hàng thành công');
        cartStore.fetchCart();
        selected.value = cartStore.carts.map(() => false);
    
    } catch (error) {           
        alert("Không thể đặt hàng");
    }
}
const handleDelete = async (cart:Cart) => {
    try {
        await deleteCartShopping(cart.ID_CART);
        cartStore.fetchCart();
        selected.value = cartStore.carts.map(() => false);
        alert('Xóa thành công');
        Price();
    } catch (error:any) {
        console.log('error', error);
        alert("Không thể xóa");
    }
}

</script>
<template>
    <div class="container">
        <div class="infor">    
            <div class="select">
                <label id="tickAll">
                    <input type="checkbox" id="selectAllCart" v-model="selectAll">
                    Chọn tât cả
                </label>
                <div class="Quantity-price">
                    <p>Số lượng</p>
                    <p>Thành tiền</p>
                </div>
            </div>
            <div class="product">
                <div class="empty" v-if="cartStore.carts.length === 0">
                    <img :src="bookStore.getImg('/upload/book/empty.jpg')" alt="" class="emptyIMg">
                    <p>Chưa có sản phẩm nào trong giỏ hàng của bạn</p>
                    <button class="returnOrder" @click="router.push('/')">Mua sắm ngay</button>
                </div>
                <div class="book-cart" v-for="(cart, index) in cartStore.carts">
                    <div class="img-checkbox">
                        <input type="checkbox" v-model="selected[index]">
                        <img :src="bookStore.getImg(cart.COVER_IMAGE)" alt="">
                    </div>
                    <div class="detail-price">
                        <p style="text-align: left; max-height: 40%;">{{cart.NAMEBOOK}} - {{ cart.CATEGORY }} - {{ cart.DETAIL.slice(0,60) }}...</p>
                        <div class="price" >
                            <p id="flash">{{ bookStore.getPrice(cart.FLASH_PRICE)}}</p>
                            <p id="sell">{{ bookStore.getPrice(cart.SELL_PRICE) }}</p>
                        </div>
                    </div>
                    <div class="quantitum-totalPrice">
                        <p>{{ cart.QUANTITY }}</p>
                        <p id="total">{{ bookStore.getPrice(cart.FLASH_PRICE * cart.QUANTITY) }}</p>
                        <i class="fa-solid fa-trash" @click="handleDelete(cart)"></i>
                    </div>
            </div>
        </div>
    </div>

    <div class="pay">
        <div class="input">
            <span style="margin-top: 10px;">Tên người nhận</span>
            <input type="text" :placeholder="auth.user?.NAMEUSER" readonly>
            <span>Email nhận hóa đơn</span>
            <input type="text" :placeholder="auth.user?.EMAIL" readonly>
            <span>Địa chỉ nhận hàng</span>
            <input type="text" :placeholder="auth.user?.ADDRESS"  readonly>
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
.emptyIMg{
    width: 39%;
    height: 61%;
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
    height: 537px;
    background-color: white;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    box-shadow: 0 8px 8px rgba(0, 0, 0, 0.1);
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
    width: 20%;
    display: flex;
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
    width: 99%;
    height: 120px;
    /* justify-content: space-between; */
    display: flex;
    /* border: 1px solid #ccc; */
    margin-top: 3px;
    border-radius: 12px;
}
.container{
    width: 96%;
    height: 500px;
    margin-top: 0px;
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
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
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
    border-radius: 10px;
}
.Quantity-price{
    display: flex;
    gap:30px;
    margin-right: 70px;
}
</style>