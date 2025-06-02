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
        let result = await pool.request()
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
    let data = req.body;
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

        let result = await pool.request()
            .input('id', id)
            .input('username', data.NAMEUSER)
            .input('email', data.EMAIL)
            .query(`
                UPDATE USERS
                SET NAMEUSER = @username, 
                    EMAIL = @email
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
            DELETE USERS 
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
    let { name, email, username, password } = req.body;
    try {
        let pool = await connectionDB();
        let check = await pool.request()
            .input('username', username)
            .query(`SELECT * FROM USERS WHERE USERNAME = @username`);
        if (check.recordset.length !== 0) {
            return res.status(400).send({ message: `Username nay da duoc dang ki` });
        }
        let hashPass = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000);
        await sendOTPEmail.sendOTPEmail(email, otp);

        tempDb = {
            user: {
                name,
                email,
                username,
                password: hashPass
            },
            otpdata: otp,
            timeValid: Date.now() + 5 * 60 * 1000
        }
        res.json({message: `Da gui otp den email ${email}`})
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send({message: 'Không thể gửi OTP'})
    }
}
exports.RegisterVerify = async (req, res) => {
    let { OTP } = req.body;
    let user = tempDb.user;
    let timeNow = Date.now();

    if (!OTP) 
        return res.status(500).send({ message: 'Vui long nhap OTP de xac thuc tai khoan' });
    if (OTP != tempDb.otpdata) 
        return res.status(500).send({ message: 'OTP khong hop le' });
    if (timeNow > tempDb.timeValid) 
        return res.status(400).send({ message: "OTP da het han " });

    try {
        let pool = await connectionDB();
        
        let result = await pool.request()
            .input('username', user.username)
            .input('hashpass', user.password)
            .input('name', user.name)
            .input('email', user.email)
            .query(`INSERT INTO USERS (NAMEUSER, EMAIL, USERNAME, PASSWORD) 
                VALUES (@name, @email, @username, @hashpass)`)
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
            return res.status(404).send({ message: `Khong tim thay user` });
        }
        let user = result.recordset[0];
        let isPassword = await bcrypt.compare(password, user.PASSWORD);
        if (!isPassword) {
            return res.status(400).send({ message: 'Mat khau khong hop le' });
        }
        let token = jwt.sign({ userID: user.ID, userName: user.USERNAME, role: user.ROLE }, process.env.secretPass, { expiresIn: '1h' });
        res.json({ message: `Dang nhap thanh cong với vai trò ${user.ROLE}`, token: token });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Khong the dang nhap' });
    }
}
exports.Logout = async (req, res) => {
    try {
        // cần xử lí thủ công token ở client, d
        res.json({ message: "Đăng xuất thành công" });
        // console.log(req.user);
    } catch (error) {
        return res.status(400).send({ message: "Không thể đăng xuất" });
    }
}