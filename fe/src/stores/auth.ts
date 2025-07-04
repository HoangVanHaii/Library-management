    import { defineStore } from "pinia";
    import { ref } from 'vue'
    import { inforOfme, newAccessToken } from '../api/userAPI'
    import type { User } from '../api/userAPI'
    import type { borrow } from "../api/borrowAPI";
    import { getBorrowOfme } from "../api/borrowAPI";
    import { getAllBorrow } from "../api/borrowAPI";

    export const useAuthStore = defineStore('auth',() =>{
        const user = ref<User | null>(null);
        const isLoggedIn = ref<boolean>(localStorage.getItem('accessToken') !== null)

        const getImg = (path:string) =>{
            if(/^https?:\/\//.test(path)){
                return path;
            }
            return `http://localhost:2888${path}`;
        }
            
        const fetchInfor = async()=>{
            try {
                const res = await inforOfme();
                user.value = res.user;
                isLoggedIn.value = true
                // console.log('asss');
            } 
            catch (error:any) {
                const errCode = error.response?.data.errCode;
                // console.log(error);
                if(errCode == 'ACCESS_TOKEN_EXPIRED'){
                    try {
                        await refreshAcesstoken()
                    } catch (e:any) {
                        handleLogout();
                        throw e;
                    }
                    // await fecthBorrow();
                }
                else{
                    handleLogout();
                }
            }
        }
        const refreshAcesstoken = async () => {
            try {
                const refreshToken = localStorage.getItem('refreshToken') || '';
                const res = await newAccessToken(refreshToken);
                localStorage.setItem('accessToken', res.token)
                // await fetchInfor();
            } 
            catch (error:any) {
                // console.log('lỗi',error);
                if(error.response){
                    const status = error.response.status;
                    if(status == 404){
                        console.log("Refreshtoken khôn tồn tại")
                    }
                    else if(status == 401){
                        const errCode = error.response.data.errCode;
                        if(errCode == 'INVALID_REFRESH_TOKEN'){
                            console.log('refreshToken khoog hợp lệ')
                        }
                        else{
                            console.log('refreshToken đã hết hạn')
                        }
                    }
                }
                handleLogout();
                throw error;
            }
        }
        const show = ref(false);
        const handleLogout = () => {
            isLoggedIn.value = false;
            show.value = false;
            display.value = false;
            user.value = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
        const showform = ()=>{
            show.value = !show.value;
        }
        const closeform = () => {
            show.value = false;
        }
        const display = ref(false);
        const showBorrowed = () => {
            show.value = false;
            display.value = !display.value;
            const box = document.getElementById('tabPage');
            console.log(box);
            box?.scrollIntoView({
                behavior:'smooth',
                block:'start'
            })
        }
        const closeBorrowed = () => {
            display.value = false;
        }

        const borrows = ref<borrow[]>([])
         const fecthBorrow = async() => {
            if(user && user.value?.ROLE == "ADMIN"){
                const res = await getAllBorrow();
                borrows.value = res;
            }
            else if(user && user.value?.ROLE == "USER"){
                const res = await getBorrowOfme();
                borrows.value = res;
            }
        }
        return {
            user,
            isLoggedIn,
            fetchInfor,
            handleLogout,
            getImg,
            showform,
            closeform,
            show,
            display,
            showBorrowed,
            closeBorrowed,
            borrows,
            fecthBorrow
    }
})  