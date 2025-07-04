import axios from 'axios'

export interface User{
    ID:number,
    NAMEUSER:string,
    EMAIL:string,
    USERNAME:string,
    ROLE:string,
    PASSWORD:string,
    COVER_IMAGE:string,
    ADDRESS:string
}
export const login = async(username: string, password: string) => {
    try {
        const res = await axios.post('http://localhost:2888/Library/auths/login',{
            username,
            password
        });
        return res.data;
    } catch (error: unknown) {
        console.log(error);
        throw error;
    }
}

export const registerSendOTP = async(name:string, email:string, username:string, password:string, address:string) => {
    try {
        const res = await axios.post('http://localhost:2888/Library/auths/register/sendOTP',{
            name,
            email,
            username,
            password,
            address
        })
        return res.data;
    } catch (error: unknown) {
        console.log("Khong the dang ki", error)
        throw error;
    }
}
export const registerVerifyOTP = async (OTP:number) => {
    try {
        const res = await axios.post('http://localhost:2888/Library/auths/register/verifyOTP',{
            OTP
        });
        return res.data;
    } catch (error: unknown) {
        console.error(error);
        throw error;
    }
}
export const recoverPassSendOTP = async (username:string, email: string, newpassword: string)=>{
    try {
        const res = await axios.post('http://localhost:2888/Library/auths/changePass/sendOTP', {
            username,
            email,
            newpassword
        })
        return res.data;
    } catch (error: any) {
        console.log(error);
        throw error;

    }
}
export const recoverPassVerifyOTP = async (OTP:number)=>{
    try {
        const res = await axios.post('http://localhost:2888/Library/auths/changePass/verifyOTP', {
            OTP
        })
        return res.data;
    } catch (error:any) {
        throw error;
    }
}
export const inforOfme = async() => {
    try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get('http://localhost:2888/Library/users/me', {
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error:any) {
        throw error;
    }
}
export const newAccessToken = async (refreshToken:string) => {
    try {
        const res = await axios.post('http://localhost:2888/Library/auths/refreshToken',{
            refreshToken
        })
        return res.data;
    } catch (error:any) {
        throw error;
    }
}
export const uploadIMGtoDb = async (formData:FormData) => {
    try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.post('http://localhost:2888/upload/user', formData, {
            headers:{
                Authorization: `Bearer ${token}`,
                'Content-Type':'multipart/form-data'
            }
        })
        return res.data;
    } catch (error:any) {
        console.log(error);
        throw error;
    }
}
export const changeAvatar = async (filePath:string) => {
    try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.post('http://localhost:2888/Library/users/changeAvt',{filePath},{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        return res.data;
    } catch (error:any) {
        throw error;
    }
}
export const UpdateInforMe = async(password:string, address:string, name:string, id:number) => {
    try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.put(`http://localhost:2888/Library/users/${id}`, {
            password,
            address,
            name
        }, {
            headers:{
                Authorization: `Bearer ${token}`,
            }
        })
        return res.data;
    } catch (error:any) {
        console.log(error);
        throw error;
    }
}
