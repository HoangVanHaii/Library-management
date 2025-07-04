<script setup lang="ts">
import type { Book } from '../api/bookApi';
import { getBooks } from '../api/bookApi';
import { ref, onMounted } from 'vue';
import { usebookStore } from '../stores/book';
import { useRouter } from 'vue-router';
const router = useRouter();
const bookStore = usebookStore();
const list = ref<Book[]>([]);
onMounted(async () => {
    list.value = await getBooks();
    list.value.reverse();
})

const handleBorrow = (book:Book) => {
    router.push(`/borrow/${book.ID}`)
}

const handleSeeMore = () => {
    router.push('/borrows');
}
</script>
<template>
    <div class="container">
        <h2 > <i class="fa-solid fa-border-all" style="color: red; margin-left: 10px;"></i> Sách mượn giá hời</h2>
        <hr class="divider">
        <div class="content" >
            <div class="book-card"  v-for="book in list.slice(0, 10)" :key="book.ID" @click="handleBorrow(book)">
                <img :src="bookStore.getImg(book.COVER_IMAGE)" alt="none-img">
                <div class="infor">
                    <span>{{ book.NAMEBOOK }} - {{ book.CATEGORY }}</span>
                </div>
                <div class="price">
                    <div class="sale">
                        <span id="price">{{ bookStore.getPrice(book.BORROW_PRICE - 2000) }}</span>
                        <label for="">-{{bookStore.getSale(book.BORROW_PRICE, book.BORROW_PRICE + 2000)}}%</label>
                    </div>
                    <div class="sell-quantity">
                        <span id="oldPrice">{{ bookStore.getPrice(book.BORROW_PRICE) }}</span>
                        <span id="quantity"> Còn {{ book.QUANTITY }} sách</span>
                    </div>
                </div>
            </div>
        </div>
        <button class="seeMore" @click="handleSeeMore">Xem thêm</button>

    </div>
</template>
<style scoped>
#quantity{
    color: blue;
    font-size: 14px;
}
.sell-quantity{
    display: flex;
    justify-content: space-between;
    margin-right: 4px;
}
.seeMore{
    margin: auto;
    width: 13%;
    height: 40px;
    font-size: 20px;
    padding: 4px;
    margin-bottom: 10px;
    color:#d60000;
    background-color: white;
    border: 2px solid #d60000;
}
.seeMore:hover{
    background-color: rgb(245, 240, 240);
}
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
    margin-top: 20px;
}
h2{
    text-align: left;
    background-color: rgb(177, 220, 236);
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
    grid-template-columns: repeat(5, 1fr);
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