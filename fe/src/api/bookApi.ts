import axios from 'axios'

export interface Book {
  ID: number
  NAMEBOOK: string
  AUTHOR: string
  CATEGORY: string
  STATUS: boolean
  COVER_IMAGE: string
  QUANTITY:number
  SELL_PRICE:number
  BORROW_PRICE:number
  DETAIL:string
  FLASH_PRICE: number
  FLASH_QUANTITY: number
  FLASH_START:string
  FLASH_END:string
  IS_FLASHSALE:boolean
}

export const getBooks = async () => {
  try {
    const res = await axios.get('http://localhost:2888/Library/books');
    return res.data;
  } catch (error:any) {
    throw error;
  }
}
export const getBookFlashSale = async() => {
  try {
    const res = await axios.get('http://localhost:2888/Library/books/flashSale');
    return res.data;
  } catch (error:any) {
    throw error;
  }
}
export const getTop10Sale = async() => {
  try {
    const res = await axios.get('http://localhost:2888/Library/books/top10');
    return res.data;
  } catch (error:any) {
    throw error;
  }
}
export const borrowBook = async(id:number) =>{
  try {
    const token = localStorage.getItem('accessToken');
    const res = await axios.post('http://localhost:2888/Library/borrows', 
      {id},
      {
      headers:{
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  } catch (error:any) {
    console.log(error);
    throw error;
  }
}
export const deleteBook = async (id:number) => {
  try {
    const token = localStorage.getItem('accessToken');
    const res = await axios.delete('http://localhost:2888/Library/books',{
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
export const searchBook = async(word:string, type:string) => {
  try {
    const res = await axios.post('http://localhost:2888/Library/books/search', {
      word,
      type
    });
    return res.data;
  } catch (error:any) {
    console.log(error);
    throw error;
  }
}
export const addbook = async( NAMEBOOK:string, AUTHOR:string, CATEGORY:string, PATH:string, QUANTITY: number, SELL_PRICE:number, FLASH_PRICE:number, DETAIL:string) => {
  try {
    const token = localStorage.getItem('accessToken');
    const res = await axios.post('http://localhost:2888/Library/books/',{
      NAMEBOOK,
      AUTHOR,
      CATEGORY,
      PATH,
      QUANTITY,
      SELL_PRICE,
      FLASH_PRICE,
      DETAIL
    },
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

export const getBookById = async(id:number) => {
  try {
    const res = await axios.get(`http://localhost:2888/Library/books/${id}`)
    return res.data;
  } catch (error:any) {
    throw error;
  }
}
export const setTimeFlashSale = async() => {
  try {
    const res = await axios.put('http://localhost:2888/Library/books/setTimeFlashSale');
    return res.data;
  } catch (error:any) {
    throw error;
  }
}
export const updateBookById = async(NAMEBOOK:string, AUTHOR:string, CATEGORY:string, PATH:string, QUANTITY: number, SELL_PRICE:number, FLASH_PRICE:number, DETAIL:string, id:number) => {
  try {
    const token = localStorage.getItem('accessToken');
    const res = await axios.put(`http://localhost:2888/Library/books/${id}`, {
      NAMEBOOK,
      AUTHOR,
      CATEGORY,
      PATH,
      QUANTITY,
      SELL_PRICE,
      FLASH_PRICE,
      DETAIL
    },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    return res.data;
  } catch (error:any) {
    throw error;
  }
}