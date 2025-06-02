let jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyToken = (req, res, next) => {
    let authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Không có token hoặc token sai định dạng' });
    }

    let token = authHeader.split(' ')[1];
    console.log(token);
    jwt.verify(token, process.env.secretPass, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token hết hạn hoặc không hợp lệ' });
        }
        req.user = user; 
        next(); 
    });
    
};


exports.verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(400).send({ message: 'Chi co admin moi co quyen truy cap chuc nang nay' });
    }
    next();
}
exports.verifyUser = (req, res, next) => {
    if (req.user.role !== 'USER' && req.user.role !== "ADMIN") {
        return res.status(400).send({ message: 'Ban phai dang nhap moi co quyen truy cap chuc nang nay' });
    }
    next();
}