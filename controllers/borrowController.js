const connection = require('../config/db');

exports.getAllUserBorrowBooks = async (req, res) => {
    try {
        let pool = await connection();
        let result = await pool.request().query(`
            SELECT B.ID, B.USER_ID, U.NAMEUSER, B.BOOK_ID, BOOK.NAMEBOOK, B.BORROW_DATE,B.RETURN_DATE
            FROM BORROW B INNER JOIN USERS U ON B.USER_ID = U.ID
                          INNER JOIN BOOKS BOOK ON B.BOOK_ID = BOOK.ID
            `);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send({message: "Khong lay duoc du lieu"})
    }
}
exports.GetBorrowByUserID = async (req, res) => {
    let id = req.params.id;
    try {
        let pool = await connection();
        let check = await pool.request()
            .input('id', id)
            .query(`
                SELECT *FROM USERS WHERE ID = @id
            `)
        if (check.recordset.length == 0) {
            return res.status(404).send({ message: `Khong tim thay nguoi dung co id = ${id}` });
        }

        let result = await pool.request()
            .input('id', id)
            .query(`
                SELECT U.ID, U.NAMEUSER, U.EMAIL,BK.NAMEBOOK, BK.AUTHOR ,B.BOOK_ID, B.BORROW_DATE
                FROM USERS U
                        INNER JOIN BORROW B ON U.ID = B.USER_ID
                        INNER JOIN BOOKS BK ON BK.ID = B.BOOK_ID
                WHERE U.ID = @id
            `);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send(`Khong the lay lich su nguoi dung`);
    }
}
exports.CreateNewBorrows = async (req, res) => {
    let data = req.body;
    let idUser = req.user.userID;
    try {
        let pool = await connection();
        let check = await pool.request()
        .input('BID', data.BOOK_ID)
        .query(`
            SELECT *FROM BOOKS WHERE ID = @BID AND STATUS = 0
            `)
            if (check.recordset.length != 0) {
                return res.status(409).send({ message: `Sach nay da duoc muon` });
            }
        let result = await pool.request()
            .input('UID', idUser)
            .input('BID', data.BOOK_ID)
            .query(`
                INSERT INTO BORROW (USER_ID, BOOK_ID) VALUES(@UID, @BID)
                `)
        let updateB = await pool.request().query(`UPDATE BOOKS SET STATUS = 0 WHERE ID = ${data.BOOK_ID}`)
        res.json({ message: `Muon thanh cong sach co id = ${data.BOOK_ID}` });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({message: "Khong the Muon Sach"})
    }
}

exports.getBorrowOfme = async (req, res) => {
    let idUser = req.user.userID;
    try {
        let pool = await connection();
        let result = await pool.request()
            .input('idUser', idUser)
            .query('SELECT *FROM BORROW WHERE USER_ID = @idUser');
        if (result.recordset.length === 0) {
            res.status(404).send({ message: 'Ban ch muon sach nao' });
        }
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send({message: 'Khong thuc hien duoc'})
    }
}

exports.returnBook = async (req, res) => {
    let idBorrow = req.params.idBorrow;
    let userID = req.user.userID;
    try {
        let pool = await connection();
        let check = await pool.request()
            .input('idBorrow', idBorrow)
            .query(`SELECT * FROM BORROW WHERE ID = @idBorrow`);
        if (check.recordset.length === 0) {
            return res.status(404).send({ message: `Khong tim thay phieu muon co id = ${idBorrow}` });
        }
        let idUserBorrow = check.recordset[0].USER_ID
        if (idUserBorrow != userID && req.user.role != "ADMIN") {
            res.status(403).send({ message: 'Ban khong the tra sach cho nguoi khac' });
        }
        let result = await pool.request()
            .input('idBorrow', idBorrow)
            .query('UPDATE BORROW SET RETURN_DATE = GETDATE() WHERE ID = @idBorrow');
        let upDateStatusBook = await pool.request()
            .input('idBorrow', idBorrow)
            .query(`UPDATE BOOKS SET STATUS = 1 
                    WHERE ID IN (
                        SELECT BK.ID
                        FROM BORROW BR INNER JOIN BOOKS BK ON BK.ID = BR.BOOK_ID
                        WHERE BR.ID = @idBorrow 
                    )`)
        res.json({ message: `Tra sach thanh cong` });
        // console.log(check.recordset[0].USER_ID);
    } catch (error) {
        res.status(500).send({ message: "Khong the tra sach" });
    }
}

exports.DeleteBorrow = async (req, res) => {
    let idBorrow = req.params.idBorrow;

    try {
        let pool = await connection();
        let result = await pool.request()
            .input('idBorrow', idBr)
            .query('DELETE BORROW WHERE ID = @idBr');
        let upDateStatusBook = await pool.request()
            .input('idBorrow', idBorrow)
            .query(`UPDATE BOOKS SET STATUS = 1 
                    WHERE ID IN (
                        SELECT BK.ID
                        FROM BORROW BR INNER JOIN BOOKS BK ON BK.ID = BR.BOOK_ID
                        WHERE BR.ID = @idBorrow 
                    )`)
        res.json({ message: `Xoa thanh cong phieu muon co id ${idBorrow}` });
    } catch (error) {
        res.status(500).send({ message: `Khong the xoa sach` });
    }
}