<script setup lang="ts">
import { usebookStore } from '../stores/book';

const bookStore = usebookStore();
</script>
<template>
    <div class="container">
        <h3>📦 Danh mục sản phẩm</h3>
        <hr>
        <div class="product">
            <div class="topic1">
                <img :src="bookStore.getImg('/upload/book/topicSGK12.jpg')" alt="">
                <p>Sách giáo khoa</p>
            </div>
            <div class="topic2">
                <img :src="bookStore.getImg('/upload/banner/lichsuVN.jpg')" style="width: 100%;">
                <p>Lịch sử Việt Nam</p>
            </div>
            <div class="topic4">
                <img :src="bookStore.getImg('/upload/banner/thieunhi.jpg')" style="width: 100%;">
                <p>Thiếu nhi</p>
            </div>
            <div class="topic3">
                <img :src="bookStore.getImg('/upload/banner/vutru.jpg')" style="width: 100%;">
                <p>Vũ trụ học</p>
            </div>
            <div class="topic5">
                <img :src="bookStore.getImg('/upload/banner/doisong.jpg')" style="height: 85%;">
                <p>Đời sống</p>
            </div>
            <div class="topic6">
                <img :src="bookStore.getImg('/upload/banner/kynang.jpg')" style="height: 85%;">
                <p>Kỹ năng</p>
            </div>
        </div>
    </div>
</template>
<style scoped>
.product{
    width: 90%;
    height: 63%;
    display: flex;
    margin-left: 40px;
}
.topic1,.topic2,.topic3,.topic4, .topic5{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 20%;
    height: 90%;
    padding: 3px;
    margin-top: 13px;
}
img{
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 2px;
    /* box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.3) */
}

.container{
    background-color: white;
    display: flex;
    flex-direction: column;
    height: 350px;
    margin-top: 30px;
    margin-bottom: -80px;
    border-radius: 10px;
    box-shadow: 0 8px 8px rgba(0, 0, 0, 0.1);
}
hr{
    border: none;
    height: 1px;
    background-color: #e90e0e;
    margin: -3px 0 16px 0;
}
h3{
    font-size: 30px;
    text-align: left;
    margin-top: 20px;
    margin-left: 15px;
}
</style>