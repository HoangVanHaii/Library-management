const nodemailer = require('nodemailer');
require('dotenv').config();

exports.sendOTPEmail = async (toEmail, otpCode) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.mailUser,
                pass: process.env.mailAppPass
            }
        })

        const mailTopoption = {
            from: `"Library-Management" <${process.env.mailUser}>`,
            to: toEmail,
            subject: 'Xác thực đăng kí tài khoản',
            text: `Mã xác thực của bạn là ${otpCode}`
        }
        await transporter.sendMail(mailTopoption)
    }
    catch (error) {
        console.error(error);
    }
}
exports.SuccessRegister = async (toEmail) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.mailUSer,
                pass: process.env.mailAppPass
            }
        })
        const mailOptins = {
            from: `"Library-Management" <${process.env.mailUser}>`,
            to: toEmail,
            subject: 'Đăng kí thành công thành viên thư viện',
            text:"Chúc mừng bạn trở thành thành viên thư viện onlline"
        }
        await transporter.sendMail(mailOptins);
    } catch (error) {
        throw error;
    }
}