<script setup lang="ts">
import { usebookStore } from '../../stores/book';
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, watch, computed } from 'vue';
import type { Book } from '../../api/bookApi';
import { getBookById } from '../../api/bookApi';
import { getBookOrdered } from '../../api/orderAPI';
import { getBookFlashSale } from '../../api/bookApi';
import { addCart } from '../../api/cartAPI';
import { useCartStore } from '../../stores/cart';

const cartStore = useCartStore();
const route = useRoute();
const id = route.params.id 
const listBook = ref<Book[]>([]);
const router = useRouter();
const bookStore = usebookStore();
const bookChosed = ref<Book>();
const sold = ref<number>();
const quantity = ref<number>(1);
const borderRight = ref<number>(0);

onMounted(async () => {
    window.scrollTo({
        top: 52,
        behavior: 'smooth',
    });
    const result = await getBookById(Number(id));
    sold.value = await getBookOrdered(Number(id));
    listBook.value = await getBookFlashSale();
    bookChosed.value = result;   
    getPercentBook;
})
watch(() => route.params.id, async (newId) => {
  if (newId) {
    const result = await getBookById(Number(newId));
    sold.value = await getBookOrdered(Number(newId));
    bookChosed.value = result;
    getPercentBook;
  }
});

const getPercentBook = computed(() => {
    if(sold.value && bookChosed.value){
        let value =Math.round((sold.value/(bookChosed.value?.QUANTITY + sold.value))*100)
        //nhỏ quá k đủ hiển thị
        if(value <= 2 && value > 0){
            value += 4;
        }
        if(value == 100){
            borderRight.value =  12;
        }
        return value;
    }
    return 0;
})
const getBordeRight = computed (() => {
    if(sold.value && bookChosed.value){
        let value =Math.round((sold.value/(bookChosed.value?.QUANTITY + sold.value))*100)
        if(value == 100){
            return 12;
        }
        return 0;
    }
})
const handleWatch = (book:Book) => {
    quantity.value = 1;
    router.push(`/order/${book.ID}`);
}
const handlePurchase = async() => {
    router.push({path:'/order/pay', query:{
        book_id: route.params.id,
        quantity: quantity.value
    }});
}
const handleAddCart = async() => {
    try {
        const id_book = route.params.id 
        await addCart(Number(id_book), Number(quantity.value));
        cartStore.fetchCart();
        alert("Thêm thành công vào giỏ hàng")

    } catch (error:any) {
        const status = error.response.status
        if(status == 400){
            alert('Sản phẩm hiện đã hết hàng')
        }
        else alert('Không thể thêm vào giỏ')
    }
}
</script>
<template>
    <div class="container">
        <div class="book-card">
            <section>
                <img :src="bookStore.getImg(bookChosed?.COVER_IMAGE || '')" alt="">
            </section>
            <div class="button">
                <button class="order" @click="handleAddCart"> <i class="fa-solid fa-cart-shopping"></i> Thêm giỏ hàng</button>
                <button class="buy" @click="handlePurchase">Mua ngay</button>
            </div>
            <div class="policy">
                <p>HBook.com</p>
                <span><i class="fa-solid fa-truck"></i><strong> Thời gian vận chuyển:</strong> Nhanh và uy tín</span>
                <span><i class="fa-solid fa-right-left"></i><strong> Chính sách đổi trả:</strong> Miễn phí toàn quốc</span>
                <span><i class="fa-brands fa-web-awesome"></i><strong> Chính sách bán:</strong> Ưu đãi lớn khi mua số lượng lớn</span><span></span>
            </div>
        </div>
        <div class="option">
            <div class="infor">
                <div class="content">
                    <span class="title">{{ bookChosed?.CATEGORY }} - {{ bookChosed?.NAMEBOOK }}</span>
                    <span><strong>Tác giả:</strong> {{ bookChosed?.AUTHOR }}</span>
                    <span><strong>Thông tin bổ sung:</strong> Không</span>
                </div>
                <div class="flashsale">
                    <div class="content-flashsale">
                        <span class="icon">⚡FLASH SALE</span> 
                        <span class="time" v-if="bookStore.running">Kết thúc trong <strong>{{ bookStore.countDown }}</strong></span>
                        <span class="time" v-else>Bắt đầu lúc <strong>{{ bookStore.getTimeSale() }}</strong></span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" :style="{
                            width: getPercentBook + '%', borderTopRightRadius: getBordeRight +'px', borderBottomRightRadius: getBordeRight + 'px' }">
                        </div>
                        <span class="text-sold" v-if="bookChosed?.QUANTITY != 0">Đã bán {{ sold }}</span>
                        <span class="text-sold" v-else>Hết hàng</span>
                        
                    </div>
                </div>
                <div class="price">
                    <p class="flash_price">{{ bookStore.getPrice(bookChosed?.FLASH_PRICE || 0) }}</p>
                    <p class="sell_price">{{ bookStore.getPrice(bookChosed?.SELL_PRICE || 0) }}</p>
                    <p class="percent">-{{ bookStore.getSale(bookChosed?.FLASH_PRICE ||0, bookChosed?.SELL_PRICE || 0) }}%</p>
                    <div class="quantity">
                        <button @click="quantity=Math.max(1,quantity - 1)" class="sub"><i class="fa-solid fa-minus"></i></button>
                        <strong class="quantityRef">{{ quantity }}</strong>
                        <button @click="quantity=Math.min(bookChosed?.QUANTITY || 0, quantity + 1)" class="plus"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </div>
            </div>
            <div class="book-other">
                <div class="showAll">
                    <div class="book-other-card"  v-for="book in listBook" :key="book.ID" @click="handleWatch(book)">
                        <img :src="bookStore.getImg(book.COVER_IMAGE)" alt="none-img" class="other-img">
                        <div class="inforBook"><span>{{ book.NAMEBOOK }} - {{ book.CATEGORY }}</span></div>
                        <div class="other-price">
                            <span style="color: red;font-size: 20px;">{{ bookStore.getPrice(book.SELL_PRICE) }}</span>
                            <span style="color: blue;">Còn {{ book.QUANTITY }} cuốn</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.quantityRef{
    margin: 2px;
    margin-left: 9px;
}
.inforBook{
    height: 20%;
}
.other-price{
    display: flex;
    justify-content: space-between;
    padding: 4px;
}

.showAll{
    display: flex;
    width: max-content;
    padding: 4px;
    gap:25px;
}
.other-img{
    max-width: 90%;
    max-height: 65%;
    object-fit: contain;
    box-shadow: 0 2px 2px wheat;
}
.book-other-card{
    background-color: white;
    padding: 4px;
    border-radius: 10px;
    width: 200px;
    padding: 4px;
    display: flex;
    flex-direction: column;
    border:1px solid #ccc
}
.book-other-card:hover{
    cursor: pointer;
}
.book-other{
    position: relative;
    width: auto;
    display: flex;
    flex-direction: row;
    background-color: white;
    overflow-x: auto;
    border-radius: 12px;
    margin-left: 2px;
}
.quantity{
    display: flex;
    height: 30px;
    margin-top: 18px;
    margin-left: 25px;
    border-radius: 4px;
    border:1px solid #ccc;
}
.plus,
.sub{
    width: 14px;
    height: 30px;
    font-size: 12px;
    border-radius: 4px;
    align-items: center;
    background-color: white;
    border:none;
    outline: none;
}
.sub{
    align-items: center;
}
.plus:hover{
    border:none;
}
.sub:hover{
    border: none;
}
.text-sold{
    font-size: 12.5px;
    color: red;
    font-weight: 400;
    font-family: Arial, Helvetica, sans-serif;
    position: absolute;
    margin-top: 1px;
    margin-left: 65px;
}
.progress-fill{
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    background-color: pink;
    height: 100%;
    display: flex;
    flex-direction: row;
}
.progress-bar{
    margin-left: 10%;
    margin-top: 9px;
    width: 25%;
    background-color: #fff;
    height: 18px;
    border-radius: 12px;
    box-shadow: inset 0 0 3px rgb(0, 0, 0,0,2);
    display: flex;
}
.flash_price{
    color: rgb(206, 17, 17);
    font-size: 32px;
    font-weight: normal;
    margin-top: 9px;
    margin-left:10px;
}
.sell_price{
    color: black;
    text-decoration:line-through;
    font-weight:normal;
}
.percent{
    background-color: red;
    color: white;
    height: 24px;
    font-size: 14px;
    margin-top: 24px;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
i{
    color: rgb(161, 13, 13);
}
.container{
    display: flex;
    flex-direction: row;
    width: 98%;
    height: 600px; 
    background-color: #f6f6f6;
    margin:10px 0 0 0;
    padding: 12px;
    margin-top: 0px;
}
.book-card{
    margin: 10px;
    width: 35%;
    height: 90%;
    background-color: white;
    display: flex;
    flex-direction: column;
    padding: 10px;
    align-items: center;
    border-radius: 10px;
    box-shadow: 0 8px 8px rgba(0, 0, 0, 0.1);
}
section{
    width: 90%;
    height: 60%;
    padding: 10px;
}
img{
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}
.button{
    width: 95%;
    height: 12%;
    display: flex;
    justify-content: space-between;
    padding: 1px;
}

.order{
    margin-top:6px;
    width: 49%;
    height: 80%;
    background-color: white;
    border: 1px solid rgb(189, 4, 4);
    border-radius: 6px;
    color: rgb(189, 4, 4);
}
.buy{
    margin-top:6px;
    width: 49%;
    height: 80%;
    background-color: rgb(189, 4, 4);
    border-radius: 6px;
    color: white;
}
.policy{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-top: -15px;
}
span{
    text-align: left;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
p{
    color: rgb(3, 3, 177);
    font-weight: 900;
    font-size: 20px;
    text-align: left;
}
.content{
    display: flex;
    flex-direction: column;
    padding: 4px;
}
.title{
    color: black;
    font-family: 'Courier New', Courier, monospace;
    font-weight: 400;
    font-size: 30px;
}
.flashsale{
    height: 20%;
    background-color: rgb(230, 20, 20);
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    height: 16%;
    width: 96%;
    border-radius: 10px;
    padding: 8px;
    margin-left: 7px;
}
.content-flashsale{
    background-color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
    border-radius: 10px;
    padding: 10px;
}
.icon{
    margin-left: 1rem;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    font-size: 25px;
    color: #f56f6f;
    font-style: italic;
}
.time{
    margin-left: 25px;
    font-family:Arial, Helvetica, sans-serif;
    font-size: 16px;
}
.option{
    width: 65%;
    height: auto;
    background-color: #f6f6f6;
    border-radius: 12px;
    margin: 10px;
    padding: 4px;
    display: flex;
    flex-direction: column;

}
.price{
    display: flex;
    flex-direction: row;
    gap:10px
}
.infor{
    height: auto;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 8px 8px rgba(0, 0, 0, 0.1);
    margin: 4px;
}

</style>