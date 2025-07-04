import axios from "axios";
export interface Order{
        ID_ORDER:number,
        ID_BOOK:number,
        FLASH_PRICE: number,
        SELL_PRICE:number,
        NAMEBOOK: string,
        CATEGORY: string,
        AUTHOR: string,
        COVER_IMAGE:string,
        QUANTITY:number,
        DETAIL:string,
        TOTAL_PRICE:string
}
export const getBookOrdered = async(id:number) => {
    try {
        const res = await axios.get(`http://localhost:2888/Library/orders/${id}`);
        return res.data;
    } catch (error:any) {
        throw error;
    }
}
export const createOrder = async(id:number, quantity:number, id_cart:number, total_price:number) => {
    try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.post('http://localhost:2888/Library/orders',{
            id,
            quantity,
            id_cart,
            total_price
        },{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        return res.data;
    } catch (error:any) {
        throw error;
    }
}
export const getOrderOfme = async() => {
    try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get('http://localhost:2888/Library/orders/me',{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        return res.data;
    } catch (error:any) {
        throw error;
    }
}

export const sendMail = async(email:string) => {
    try {
        const res = await axios.post('http://localhost:2888/Library/orders/sendMail',{
            email
        })
        return res.data;
    } catch (error:any) {
        throw error;
    }
}