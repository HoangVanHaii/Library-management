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
exports.registerToGiveNews = async(toEmail) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.mailUSer,
                pass: process.env.mailAppPass
            }
        });
        const mailOptions = {
            from:  `"Library-Managament" <${process.env.mailUSer}>`,
            to: toEmail,
            subject: 'Đăng kí nhận bản tin từ HBBOOK',
            text:"HBBOOK kính trọng xin chào quý khách, cảm ơn quý khách đã ghé thăm cửa hàng nhỏ HBBOOK, gói hội viên nhận bản tin hiện tại sẽ được cập nhập vào ngày 1/1/2026 mong quý khách quay lại sau! Trân trọng"
        }
        await transporter.sendMail(mailOptions);
    } catch (error) {
        
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