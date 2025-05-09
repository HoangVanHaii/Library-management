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
