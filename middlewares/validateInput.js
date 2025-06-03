exports.BookData = (req, res, next) => {
    const { NAMEBOOK, AUTHOR, CATEGORY } = req.body;
    if (!NAMEBOOK || !AUTHOR || !CATEGORY) {
        return res.status(400).send({ message: "Thieu thong tin sach" });
    }
    next();
}
exports.UserLogin = (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send({ message: "Thieu thong tin dang nhap" });
    }
    next();
}
exports.BorrowData = (req, res, next) => {
    const id_Book  = req.body;
    if ( !id_Book) {
        return res.status(400).send({ message: 'Thieu thong tin phieu muon' });
    }
    next();
}
exports.UserRegister = (req, res, next) => {
    const { name, email, username, password } = req.body;
    if (!name || !email || !username || !password) {
        return res.status(500).send({ message: "Thieu thong tin dang ky" });
    }
    next();
}
exports.VerifyOTP = (req, res, next) => {
    const { OTP } = req.body;
    if (!OTP) {
        return res.status(500).send({ message: "Vui lòng nhập mã xác thực" });
    }
    next();
}
exports.refreshTokenData = (req, res, next) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(500).send({ message: "Vui lòng nhập refresh token để cấp lại token mới" });
    }
    next();
}
