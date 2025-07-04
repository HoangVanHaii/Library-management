<script setup lang="ts">
import { usebookStore } from '../stores/book';
import { onMounted, ref } from 'vue';

const bookStore = usebookStore();
const arrayImg = ['/upload/banner/banner1.jpg',
                '/upload/banner/banner2.jpg',
                '/upload/banner/banner4.jpg',
            '/upload/banner/banner8.jpg']
let index = 0;//ref<number>(0);
const currentImg = ref<string>(arrayImg[index]);
onMounted(() => {
    setInterval(() => {
        index = (index + 1) % 4;
        currentImg.value = arrayImg[index];
    }, 2500);
})

const handleBanner = () => {
    window.scrollTo({
        top:1200,
        behavior:'smooth'
    })
}
</script>
<template>
    <div class="banner" @click="handleBanner">
        <div class="auto">
            <img :src="bookStore.getImg(currentImg)" alt="" class="bigbanner">
        </div>
        <div class="double">
            <img :src="bookStore.getImg('/upload/banner/banner5.jpg')" class="img2">
            <img :src="bookStore.getImg('/upload/banner/banner7.jpg')" class="img1">
        </div>
    </div>
</template>
<style scoped>
.img1{
    height: 50%;
    margin-top: 5px;

}
.img2{
    height: 50%;
}
.double{
    width: 40%;
    height:375px;
    display: flex;
    flex-direction: column;
    margin-left: 4px;
}
img{
    max-width: 100%;
    max-height: 100%;
    border-radius: 10px;
    object-fit: cover;
}
.bigbanner{
    width: 100%;
    height: 100%;
}
.banner{
    width: 100%;
    height: 390px;
    margin-top: 20px;
    display: flex;
    flex-direction: row;
}
.auto{
    margin-top: 10px;
    width: 65%;
    height: 90%;
    margin: auto;
}
</style>