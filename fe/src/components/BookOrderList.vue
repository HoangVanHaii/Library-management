<script setup lang="ts">
import type { Book } from '../api/bookApi';
import { getBooks } from '../api/bookApi';
import { ref, onMounted } from 'vue';
import { usebookStore } from '../stores/book';
import { useRouter, useRoute } from 'vue-router';
import { getTop10Sale } from '../api/bookApi';
import { deleteBook } from '../api/bookApi';
const route = useRoute();
const router = useRouter();
const bookStore = usebookStore();
const list = ref<Book[]>([]);
const top10bookSale = ref<Book[]>([]);
onMounted(async () => {
    list.value = await getBooks();
    top10bookSale.value = await getTop10Sale();
})

const handleOrder = (book:Book) => {
    router.push(`/order/${book.ID}`)
}
const current_tab = ref<'de-xuat'|'Top-sell'>('de-xuat');
const getMargin = () => {
    if(current_tab.value === 'de-xuat'){
        return 42;
    }
    else return 113;
}
const getWithHr = () =>{
    if(current_tab.value === 'de-xuat'){
        return 4;
    }
    else return 13;
}
const handleAddBook = async () => {
    router.push('/admin/book/addbook');
}
const handleDelete = async (book:Book) => {
    try {
        await deleteBook(book.ID);
        alert('Xóa thành công sách');
        list.value = await getBooks();
    } catch (error:any) {
        if(error.response){
            const status = error.response.status;
            if(status == 400){
                alert('Sách này đang được mượn');
            }
            else {
                alert('Không thể xóa sách')
            }
        }
    }

}
const handleUpdate = (book:Book) => {
    router.push(`/admin/book/updateBook/${book.ID}`)
}
</script>
<template>
    <div class="container">
        <h2 v-if="route.path != `/admin/book`" > <i class="fa-solid fa-arrow-up-right-dots" style="color: red;"> </i> Xu hướng mua sắm</h2>
        <h2 v-else> Quản lý sách trong cửa hàng</h2>
        <hr class="divider">
        <ul class="tab">
            <li :class="{active: current_tab === 'de-xuat'}" @click="current_tab = 'de-xuat'">Đề xuất</li>
            <li :class="{active: current_tab === 'Top-sell'}" @click="current_tab = 'Top-sell'">Sách HOT - giảm sốc</li>
        </ul>
        <hr :style="{marginLeft: getMargin() + 'px', width: getWithHr() + '%'}" class="hr">
        <div class="content" v-if="current_tab === 'de-xuat'">
            <div v-if="route.path == '/admin/book'" class="book-card" @click="handleAddBook">
                <img :src="bookStore.getImg('/upload/book/addBook.jpg')" alt="none-img">
                <p class="addBook">Thêm sách mới</p>
            </div>
            <div class="book-card"  v-for="book in list" :key="book.ID" @click="handleOrder(book)">
                <img :src="bookStore.getImg(book.COVER_IMAGE)" alt="none-img">
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
                 <div v-if="route.path === '/admin/book'" class="btn" @click.stop>
                    <button id="update" @click="handleUpdate(book)">Sửa</button>
                    <button id="delete" @click="handleDelete(book)">Xóa</button>
                </div>
            </div>
        </div>
         <div class="content" v-if="current_tab === 'Top-sell'">
            <div class="book-card"  v-for="book in top10bookSale" :key="book.ID" @click="handleOrder(book)">
                <img :src="bookStore.getImg(book.COVER_IMAGE)" alt="none-img">
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
               
            </div>
        </div>
    </div>
</template>
<style scoped>
button{
    padding: 0px;
    width: 25%;
    width: 35%;
    font-size: 13px;
}
#update{
    background-color: rgb(10, 10, 228);
    color: rgb(252, 238, 238);
}
#update:hover{
    transform: translateY(-2px);
    background-color: rgb(10, 10, 212);
}
#delete{
    background-color: rgb(184, 12, 12);
    color: white;
}
#delete:hover{
    transform: translateY(-2px);
    background-color: rgb(170, 9, 9);
    color: white;
}

.btn{
    display: flex;
    /* justify-content: space-between; */
    margin-left: 25%;
    gap:10px
}
.addBook{
    background-color: rgb(206, 5, 5); 
    color: white; 
    border-radius: 10px; 
    font-size: 18px;
    padding: 10px;
    margin: auto;
}
.divider{
    margin-top: -19px;
}
ul{
    display: flex;
    list-style: none;
    gap:20px;
}
.hr{
    height: 1px;
    background-color: red;
    margin-top: -10px;
}
li{
    color: black;
    font-family:Arial, Helvetica, sans-serif
}
.Topsell{
    width: 100%;
    height: 500px;
    background-color: aqua;
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
.container{
    background-color: white;
    box-shadow: 0 8px 8px rgba(0, 0, 0, 0.1);
    margin-top: 10px;
}
h2{
    text-align: left;
    background-color: pink;
    width: 100%;
    height: 50px;
}
li:hover{
    cursor: pointer;
}
img{
    width: 90%;
    height: 65%;
    object-fit: contain;
    margin-left: 10px;
    box-shadow: 0 2px 2px wheat;
}
.content{
    margin:10px;
    width: auto;
    height: auto;
    background-color: #f6f6f6;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap:10px;
    padding: 10px;
}

.book-card{
    /* width: 23%; */
    height: auto;
    background-color: white;
    display: flex;
    flex-direction: column;
    padding: 4px;
    border-radius: 10px;
}
.book-card:hover{
    transform: translateY(-3px);
    box-shadow: 0 8px 8px rgba(0, 0, 0, 0.1);
    background-color: rgb(245, 252, 251);
    cursor: pointer;
}
.infor{
    height: 15%;
}
.price{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-top: 6px;
}
.sale{
    display: flex;
    flex-direction: row;
    gap:16px
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
</style>