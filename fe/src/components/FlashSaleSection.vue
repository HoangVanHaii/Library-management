<script setup lang="ts">
import { getBookFlashSale } from '../api/bookApi';
import type { Book } from '../api/bookApi';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { usebookStore } from '../stores/book';
import { useRouter } from 'vue-router';
import { getBookOrdered } from '../api/orderAPI';

const bookStore = usebookStore();
const auth = useAuthStore();
const router = useRouter();
const soldMap = ref<{[key:number]:{sold:number, value:number}}>({});

onMounted(async() => {
    bookStore.books = await getBookFlashSale();
    for(let i = 0 ; i < bookStore.books.length; i++){
        const book = bookStore.books[i];
        const res = await getBookOrdered(book.ID);
        const sold = res || 0;
        let percent = Math.round((sold / (book.QUANTITY + sold)) * 100);
        if (percent <= 2 && percent > 0) {
            percent += 4;
        }
        let value = 0;
        if(percent == 100){
            value = 12;
        }
        soldMap.value[book.ID] = {sold: percent, value: value};
    }
    if (bookStore.books && bookStore.books.length > 0) {
        bookStore.updateCountDown();
        setInterval(bookStore.updateCountDown, 1000);
    }
})
const handleOrder = (book:Book) => {
    router.push(`/order/${book.ID}`);
}

</script>
<template>
    <div class="container">
        <div class="footer">
            <span class="icon">⚡FLASH SALE</span> 
            <span class="time" >Kết thúc trong {{ bookStore.countDown }}</span>
        </div>
        <div class="content">
            <div class="book-card"  v-for="book in bookStore.books" :key="book.ID" @click="handleOrder(book)">
                <img :src="auth.getImg(book.COVER_IMAGE)" alt="none-img">
                <div class="infor">
                    <span>{{ book.NAMEBOOK }} - {{ book.CATEGORY }}</span>
                </div>
                <div class="price">
                    <div class="sale">
                        <span id="price">{{ bookStore.getPrice(book.FLASH_PRICE) }}</span>
                        <label for="">-{{bookStore.getSale(book.FLASH_PRICE, book.SELL_PRICE)}}%</label>
                    </div>
                    <span id="oldPrice">{{ bookStore.getPrice(book.SELL_PRICE) }}</span>
                </div>
                <div class="progress-bar">
                       <div
                            v-if="soldMap[book.ID]"
                            class="progress-fill"
                            :style="{
                                width: soldMap[book.ID].sold + '%',
                                borderTopRightRadius: soldMap[book.ID].value + 'px',
                                borderBottomRightRadius: soldMap[book.ID].value + 'px'
                            }"
                        ></div>

                        <span class="text-sold" v-if="book?.QUANTITY != 0">Đã bán {{  }}</span>
                        <span class="text-end" v-else>Hết hàng</span>
                        
                    </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.progress-bar{
    margin-left: 17%;
    margin-top: 9px;
    width: 65%;
    background-color: #e9bebe;
    height: 18px;
    border-radius: 12px;
    box-shadow: inset 0 0 3px rgb(0, 0, 0,0,2);
    display: flex;
}
.progress-fill{
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    background-color: red;
    height: 100%;
    display: flex;
    flex-direction: row;
}
.text-sold{
    font-size: 12.5px;
    color: black;
    font-weight: 400;
    font-family: Arial, Helvetica, sans-serif;
    position: absolute;
    margin-top: 1px;
    margin-left: 45px;
}
.text-end{
    font-size: 12.5px;
    color: white;
    font-weight: 400;
    font-family: Arial, Helvetica, sans-serif;
    position: absolute;
    margin-top: 1px;
    margin-left: 40px;
}
    .container{
        display: flex;
        flex-direction: column;
        align-items: center;
        height:380px;
        background-color: #f56f6f;
        padding: 15px;
        margin-top: 10px;

    }
    .footer{
        position: relative;
        display: flex;
        justify-content: flex-start;
        height: 16%;
        width: 100%;
        border-radius: 10px;
        background-color: white;
    }
    .content{
        margin:10px;
        position: relative;
        width: 100%;
        height: 82%;
        /* background-color: white; */
        display: flex;
        flex-direction: row;
        gap:10px;
    }
    .sale{
        display: flex;
        flex-direction: row;
        gap:16px
    }
    label{
        width: auto;
        height: auto;
        background-color: #ca1111;
        color: white;
        font-weight: 500;
        font-size: 13px;
        border-radius: 4px;
    }
    .price{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin-top: 6px;
    }
    .book-card:hover{
        transform: translateY(-3px);
        box-shadow: 0 8px 8px rgba(0, 0, 0, 0.1);
        background-color: rgb(245, 252, 251);
        cursor: pointer;
    }
    #price{
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        color: red;
        text-align: left;
        margin-left: 6px;
    }
    #oldPrice{
        text-align: left;
        margin-left: 6px; 
        text-decoration: line-through;

    }
    .book-card{
        width: 23%;
        height: 100%;
        background-color: white;
        display: flex;
        flex-direction: column;
        padding: 4px;
        border-radius: 10px;
    }
    .infor{
        height: 15%;
    }
    img{
        width: 90%;
        /* height: 65%; */
        max-height: 170px;
        object-fit: contain;
        margin-left: 10px;
        box-shadow: 0 2px 2px wheat;
    }
    .icon{
        margin-top: 0.75rem;
        margin-left: 1rem;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: bold;
        font-size: 25px;
        color: #f56f6f;
        font-style: italic;
    }
    .time{
        margin-left: 25px;
        margin-top: 1rem;
        font-weight: bold;
        font-size: 16px;
    }
</style>