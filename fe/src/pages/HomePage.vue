<script setup lang="ts">
import flashSale from '../components/FlashSaleSection.vue'
import Banner from '../components/Banner.vue'
import Topic from '../components/Topic.vue'
import BookOrderListDemo from '../components/BookOrderListDemo.vue'
import BookBorrowListDemo from '../components/BookBorrowListDemo.vue'
import { onMounted, onBeforeMount } from 'vue'


</script>
<template>
    <Banner />
    <flash-sale/> 
    <topic />
    <BookOrderListDemo />
    <BookBorrowListDemo />
</template>