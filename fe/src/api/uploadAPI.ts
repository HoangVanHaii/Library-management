import axios from "axios";

export const uploadFileToDb = async(formData:FormData) => {
    try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.post('http://localhost:2888/upload',formData,{
            headers:{
                Authorization: `Bearer ${token}`,
                'Content-Type':'multipart/form-data'
            },
        } )
        return res.data;
    } catch (error:any) {
        console.log(error);
        throw error;
    }
}