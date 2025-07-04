import { defineStore } from "pinia";
import { ref } from "vue";
import type { Book } from "../api/bookApi";
import { setTimeFlashSale } from "../api/bookApi";


export const usebookStore = defineStore('book', () => {
    const getImg = (path:string) =>{
        if(/^https?:\/\//.test(path)){
            return path;
        }
        return `http://localhost:2888${path}`;
    }
    const getPrice = (price:number) => {
        if(price){
            return price.toLocaleString('vi-VN') +'đ'
        }
        else return '0đ'
    }
    const getSale = (flash_price:number, price:number) =>{
        return Math.round(((price-flash_price)/price)*100);
    }
    const getTimeSale = () => {
        if(books && books.value.length > 0 ){
            return books.value[0].FLASH_START.substring(11,19);
        }
    }
    const books = ref<Book[]>([]);
    const running = ref<boolean>(false);
    const countDown = ref<string>('');
    const updateCountDown = async()=>{
        if (books.value && books.value.length > 0) {
            const now = new Date().getTime();
            const start = new Date(books.value[0].FLASH_START).getTime() 
            const end = new Date(books.value[0].FLASH_END).getTime()
            const diff = end - now;
            running.value = (now >= start && now <= end);

            if(diff <= 0){
                await setTimeFlashSale();
                return countDown.value = '00 : 00 : 00';
            }
        
            const hours = String(Math.floor(diff/(1000 * 60 *60))).padStart(2, '0');
            const minutes = String(Math.floor((diff/(1000 * 60)) % 60)).padStart(2, '0');
            const seconds = String(Math.floor((diff/1000) % 60)).padStart(2, '0');
        
            countDown.value = `${hours} : ${minutes} : ${seconds}`
        }
    }
    const booklist = ref<Book[]>([]);
    // const fecthbook = async() => {
        
    //     const res = await getBooks();
    //     console.log("res la Array ",Array.isArray(res))
    //     console.log("res", res.length);
    //     booklist.value = res;
    //     // console.log("book",res.data);
    //     console.log("book list la Array ",Array.isArray(booklist.value))
    // }
    return {getImg, getPrice, getSale, running, updateCountDown, books,countDown, getTimeSale, booklist}

})