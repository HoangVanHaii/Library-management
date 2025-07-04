<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { searchBook } from '../../api/bookApi';
import type { Book } from '../../api/bookApi';
import { usebookStore } from '../../stores/book';
const bookStore = usebookStore();
const route = useRoute();
const router = useRouter();
const word = ref<string>(`${route.query.word}`);
const type = ref<string>(`${route.query.type }`);
const books = ref<Book[]>([]);

onMounted(async() => {
    console.log(word.value, type.value);
    books.value = await searchBook(word.value, type.value);
    console.log(books.value);
})
watch(() => route.query, async(newQuery) => {
    if(newQuery){
        const word = newQuery.word as string || '';
        const type = newQuery.type as string || '';
        books.value = await searchBook(word, type);
    }
})
const handleOrder = (book: Book) => {
    router.push(`/order/${book.ID}`)
}

</script>
<template>
    <div class="searchresult">
        <div class="title">
            <span id="find">Kết quả tìm kiếm: </span>
            <span style="color: blue; font-size: 23px;"> {{ books.length }} sản phẩm</span>
        </div>
        <hr>
        <div class="content">
            <div class="book-card"  v-for="book in books" :key="book.ID" @click="handleOrder(book)">
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
hr{
    width: 95%;
}
#find{
    color: black;
}

.searchresult{
  display: flex;
  flex-direction: column;
  background-color: #f6f6f6;
  margin-top: 60px;
  border-radius: 20px;
}
.title{
    width: 100%;
    height: 6%;
    border-radius: 10px;
    margin-bottom: 10px;
}
.sort{
    width: 100%;
    height: 15%;
    background-color: rgb(77, 202, 60);
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
    height: 270px;
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
.price{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-top: 6px;
}
img{
    width: 90%;
    height: 65%;
    object-fit: contain;
    margin-left: 10px;
    box-shadow: 0 2px 2px wheat;
}
</style>