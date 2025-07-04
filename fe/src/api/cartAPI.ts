import axios from "axios";
export interface Cart{
    ID_CART:number
    ID_BOOK:number,
    COVER_IMAGE:string,
    DETAIL:string, 
    SELL_PRICE:number,
    FLASH_PRICE:number,
    QUANTITY:number,
    NAMEBOOK:string,
    AUTHOR:string,
    CATEGORY:string
}

export const addCart = async(id:number, quantity:number) => {
    try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.post('http://localhost:2888/Library/carts/addCart',{
            id,
            quantity
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
export const getShoppingCartOfme = async() => {
    try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get('http://localhost:2888/Library/carts/cartShop/me',{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        return res.data;
    } catch (error:any) {
        throw error;
    }
}
export const deleteCartShopping = async(id:number) => {
    try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.delete('http://localhost:2888/Library/carts/delete',{
            headers:{
                Authorization: `Bearer ${token}`
            },
            data: {id}
        })
        return res.data;

    } catch (error:any) {
        throw error;
    }
}