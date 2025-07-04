import axios from "axios";

export const getBorrowOfme = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get('http://localhost:2888/Library/borrows/me',{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        return res.data;
    } catch (error) {
        throw error;
    }
}

export interface borrow{
    ID:number,
    NAMEUSER:string,
    NAMEBOOK:string,
    BORROW_DATE:string,
    RETURN_DATE:string
}
export const returnBook = async(id:number) => {
    try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.post('http://localhost:2888/Library/borrows/return',
            {id},
            {
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        return res.data;
    } catch (error:any) {
        console.log(error);
        throw error;
    }
}
export const deleteBorrow = async(id:number) => {
    try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.delete('http://localhost:2888/Library/borrows',{
            headers:{
                Authorization: `Bearer ${token}`
            },
            data:{id}
        })
        return res.data;
    } catch (error:any) {
        throw error;
    }
}
export const getAllBorrow = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get('http://localhost:2888/Library/borrows',{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        return res.data;
    } catch (error:any) {
        throw error;
    }
}
export const createBorrow = async(books:number[]) => {
    try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.post('http://localhost:2888/Library/borrows',{
            books
        },{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error:any) {
        throw error;
    }
}