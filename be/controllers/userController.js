const connectionDB = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendOTPEmail = require('../utils/sendOTP')
require('dotenv').config();

exports.GetAllUsers = async (req, res) => {
    try {
        let pool = await connectionDB();
        let result = await pool.request().query(`
            SELECT *FROM USERS
            `)
        if (result.recordset.length === 0) {
            return res.status(404).send({ message: "Khong co user nao" });
        }
        res.json(result.recordset);
    }
    catch (err) {
        res.status(500).send({message: "Khong lay du lieu duoc"});
    }
}
exports.GetUsersById = async (req, res) => {
    try {
        let id = req.params.id;
        let pool = await connectionDB();
        let result = await pool.request()
            .input('id', id)
            .query(`
            SELECT *FROM USERS
            WHERE ID = @id;
                `)
        if (result.recordset.length === 0) {
            return res.status(404).send({ message: `Khong tim thay User co id = ${id}` });
        }
        res.json(result.recordset);
    }
    catch (er) {
        res.status(500).send('khong the hien thi user ');
    }
}
exports.CreateNewUser = async (req, res) => {
    let data = req.body;
    try {
        let pool = await connectionDB();
        await pool.request()
            .input('username', data.NAMEUSER)
            .input('email', data.EMAIL)
            .query(`
                INSERT INTO USERS VALUES (@USERNAME, @EMAIL)
                `)
        res.json({ message: `Them thanh cong user ` });
    }
    catch (err) {
        res.status(500).send('khong the tao moi user');
    }
}

exports.UpdateUserById = async (req, res) => {
    let id = req.params.id;
    let {password, address, name} = req.body;
    try {
        let pool = await connectionDB();
        let check = await pool.request()
            .input('id', id)
            .query(`
            SELECT *FROM USERS
            WHERE ID = @id;
            `)
        if (check.recordset.length === 0) {
            return res.status(404).send({message: `Khong tim thay user co id ${id}`})
        } 
        let hashPass = null;
        if(password){
            hashPass = await bcrypt.hashSync(password, 10);
        }
        await pool.request()
            .input('id', id)
            .input('password', hashPass || check.recordset[0].PASSWORD)
            .input('address', address || check.recordset[0].ADDRESS)
            .input('nameuser', name || check.recordset[0].NAMEUSER)
            .query(`
                UPDATE USERS
                SET PASSWORD = @password, 
                    ADDRESS = @address,
                    NAMEUSER = @nameuser
                WHERE ID = @id;
                `)
        res.json({ message: `Da cap nhap xong user co id = ${id}` });
        
    } catch (error) {
        res.status(500).send({ message: `Khong the cap nhap user id = ${id}` });
    }
}
exports.DeleteUserById = async (req, res) => {
    let id = req.params.id;
    try {
        let pool = await connectionDB();
        let check = await pool.request()
            .input('id', id)
            .query(`
            SELECT *FROM USERS
            WHERE ID = @id;
            `)
        if (check.recordset.length === 0) {
            return res.status(404).send({ message: `Khong tim thay user co id = ${id}` })
        }
        let result = await pool.request()
            .input('id', id)
            .query(`
            DELETE FROM USERS 
            WHERE ID = @id;
            `)
        res.json({ message: `Xoa thanh cong user co id = ${id}` });
    } catch (error) {
        res.status(500).send({ message: `khong the xoa user co id = ${id}` });
    }
}

//Register
let tempDb = {};
exports.RegisterSendOTP = async (req, res) => {
    let { name, email, username, password, address } = req.body;
    try {
        let pool = await connectionDB();
        let check = await pool.request()
        .input('username', username)
        .query(`SELECT * FROM USERS WHERE USERNAME = @username`);
        if (check.recordset.length !== 0) {
            return res.status(409).send({ message: `Username nay da duoc dang ki` });
        }
        let hashPass = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000);
        await sendOTPEmail.sendOTPEmail(email, otp);

        tempDb = {
            user: {
                name,
                email,
                username,
                password: hashPass,
                address
            },
            otpdata: otp,
            timeValid: Date.now() + 5 * 60 * 1000
        }
        console.log(tempDb.otpdata);

        res.json({message: `Da gui otp den email ${email}`})
    }
    catch (error) {
        console.error(error);
        res.status(500).send({message: 'Không thể gửi OTP'})
    }
}
exports.RegisterVerify = async (req, res) => {
    let { OTP } = req.body;
    let user = tempDb.user;
    let timeNow = Date.now();

    if (!OTP) 
        return res.status(400).send({ 
            message: 'Vui long nhap OTP de xac thuc tai khoan',
            errCode: 'none-OTP' });
    if (OTP != tempDb.otpdata) 
        return res.status(400).send({ message: 'OTP khong hop le',
        errcode:'invalid-OTP' });
    if (timeNow > tempDb.timeValid) 
        return res.status(400).send({ message: "OTP da het han ", errCode: 'expired-OTP' });

    try {
        let pool = await connectionDB();
        
        const defaultImg = '/upload/user/user.jpg'
        let result = await pool.request()
            .input('username', user.username)
            .input('hashpass', user.password)
            .input('name', user.name)
            .input('email', user.email)
            .input('address', user.address)
            .input('img', defaultImg)
            .query(`INSERT INTO USERS (NAMEUSER, EMAIL, USERNAME, PASSWORD, COVER_IMAGE, ADDRESS) 
                VALUES (@name, @email, @username, @hashpass, @img, @address)`)
        await sendOTPEmail.SuccessRegister(user.email);
        res.json({ message: 'Dang ki thanh cong' });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Dang ki that bai',
            data: error.message
        })

    }
}
exports.UserLogin = async (req, res) => {
    let { username, password } = req.body;
    try {
        let pool = await connectionDB();

        let result = await pool.request()
            .input('username', username)
            .query(`SELECT *FROM USERS WHERE USERNAME = @username`);
        if(result.recordset.length === 0){
            return res.status(401).send({
                errCode: 'Invalid_user',
                message: 'Tên đăng nhập hoặc mật khẩu không đúng'
            });
        }

        let user = result.recordset[0];

        let isPassword = await bcrypt.compare(password, user.PASSWORD);
        if (!isPassword) {
            return res.status(401).send({
                errCode: 'Invalid_pass',
                message: 'Tên đăng nhập hoặc mật khẩu không đúng'
            });
        }
        let token = jwt.sign(
            { userID: user.ID, userName: user.USERNAME, role: user.ROLE },
            process.env.secretPass,
            { expiresIn: '1m' }
        );
        let refreshToken = jwt.sign(
            { userID: user.ID, userName: user.USERNAME, role: user.ROLE },
            process.env.secretPass,
            { expiresIn: '7d' }
        );

        // delete old refresh token and insert new one into the database
        await pool.request()
            .input('token', refreshToken)
            .input('user_id', user.ID)
            .query(
                `DELETE REFRESH_TOKEN WHERE USER_ID = @user_id;
                INSERT INTO REFRESH_TOKEN(TOKEN, USER_ID) VALUES(@token, @user_id)`
            );
        
        res.json({
            message: `Dang nhap thanh cong với vai trò ${user.ROLE}`,
            token: token,
            refreshToken: refreshToken
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Khong the dang nhap' });
    }
}
exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    try {
        let pool = await connectionDB();
        let decode = jwt.verify(refreshToken, process.env.secretPass);
        // console.log(decode);
        let check = await pool.request()
            .input('token', refreshToken)
            .input('id', decode.userID)
            .query(`SELECT *FROM REFRESH_TOKEN WHERE TOKEN = @token AND USER_ID = @id`);
        
        if (check.recordset.length == 0) {
            return res.status(404).send({ message: "Refresh token không tồn tại trong hệ thống" });
        }
        const newAccessToken = jwt.sign(
            { userID: decode.userID, userName: decode.userName, role: decode.role},
            process.env.secretPass,
            { expiresIn: '10m' }
        );
        res.json({
            message: "Cấp lại access token thành công",
            token: newAccessToken
        })
    } catch (error) {
        console.error(error);
        if (error.name == 'TokenExpiredError') {
            return res.status(401).send({
                errCode: 'REFRESH_TOKEN_EXPIRED',
                message: "Refresh token đã hết hạn"
            });
        }
        else {
            return res.status(401).send({
                errorCode: "INVALID_REFRESH_TOKEN",
                message: "Refresh token không hợp lệ"
            });
        }
    }
}
exports.Logout = async (req, res) => {
    try {
        let pool = await connectionDB();        
        await pool.request().input('id' ,req.user.userID)
            .query('DELETE REFRESH_TOKEN WHERE USER_ID = @id');
        
        // console.log("Rows affected:", logout.rowsAffected); 
        res.json({ message: "Đăng xuất thành công" });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Không thể đăng xuất" });
    }
}

exports.forgetPassSendOtp = async (req, res) => {
    const { username, email, newpassword } = req.body;
    try {
        let pool = await connectionDB();
        let check = await pool.request()
            .input('username', username)
            .input('email', email)
            .query('SELECT *FROM USERS WHERE USERNAME = @username AND EMAIL = @email');
        if (check.recordset.length === 0) {
            return res.status(404).send({
                errCode: "invalid_user",
                message: "Không tìm thấy người dùng"
            });
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        await sendOTPEmail.sendOTPEmail(email, otp);
        const hashPass = await bcrypt.hash(newpassword, 10);
        tempDb = {
            user: {
                username,
                password: hashPass
            },
            otpdata: otp,
            timeValid: Date.now() + 5 * 60 *1000
        }

        return res.send({ message: `Đã gửi mã OTP đến ${email}` });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({message: 'Không thể gửi OTP'})
    }
}
exports.forgetPassVerifyOtp = async (req, res) => {
    let { OTP } = req.body;
    let user = tempDb.user;
    let timeNow = Date.now();

    if (!OTP) 
        return res.status(400).send({ 
            message: 'Vui long nhap OTP de xac thuc tai khoan',
            errCode: 'none-OTP' });
    if (OTP != tempDb.otpdata) 
        return res.status(400).send({ message: 'OTP khong hop le',
        errcode:'invalid-OTP' });
    if (timeNow > tempDb.timeValid) 
        return res.status(400).send({ message: "OTP da het han ", errCode: 'expired-OTP' });
    try {
        let pool = await connectionDB();
        await pool.request().input('username', user.username)
            .input('password', user.password)
            .query('UPDATE USERS SET PASSWORD = @password WHERE USERNAME = @username');
        return res.send({message :"Đổi mật khẩu thành công"})
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: "Không thể đổi mật khẩu"})
    }
}
exports.informationOfme = async (req, res) => {
    try {
        const user = req.user;
        const pool = await connectionDB();
        const result = await pool.request().input('id', user.userID)
            .query('SELECT *FROM USERS WHERE ID = @id')
        return res.send({message: 'Lấy thông tin thành công', user:result.recordset[0]});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"Không thể lấy thông tin"})
    }
}
exports.changeAvatar = async(req, res) => {
    const {filePath} = req.body;
    const id = req.user.userID;
    try {
        const pool = await connectionDB();
        await pool.request().input('id', id).input('cover_image', filePath)
            .query('UPDATE USERS SET COVER_IMAGE = @cover_image WHERE ID = @id');
        return res.json({message: "Đổi ảnh thành công"});
    } catch (error) {
        return res.status.send({message: "Không thể đổi ảnh"});
    }
}