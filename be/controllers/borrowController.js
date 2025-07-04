const connection = require('../config/db');

exports.getAllUserBorrowBooks = async (req, res) => {
    try {
        let pool = await connection();
        let result = await pool.request().query(`
            SELECT B.ID, U.NAMEUSER, BOOK.NAMEBOOK, B.BORROW_DATE,B.RETURN_DATE
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
    const { books } = req.body;  // books = [1, 3, 5]
    const userId = req.user.userID;

    if (!Array.isArray(books) || books.length === 0) {
        return res.status(400).json({ message: 'Không có sách nào để mượn' });
    }

    try {
        const pool = await connection();
        const bookIdsStr = books.join(',');

        const bookQuery = await pool.request().query(`
            SELECT * 
            FROM BOOKS 
            WHERE ID IN (${bookIdsStr})
        `);

        const availableBooks = bookQuery.recordset;

        if (availableBooks.length !== books.length) {
            return res.status(404).json({ message: 'Một số sách không tồn tại' });
        }

        const unavailableBook = availableBooks.find(b => b.QUANTITY < 1);
        if (unavailableBook) {
            return res.status(409).json({ message: `Sách ID ${unavailableBook.ID} đã hết` });
        }
        const borrowDate = new Date();
        const dueDate = new Date(borrowDate);
        dueDate.setDate(dueDate.getDate() + 7);

        const insertBorrow = await pool.request()
            .input('USER_ID', userId)
            .input('BORROW_DATE', borrowDate)
            .input('DUE_DATE', dueDate)
            .query(`
                INSERT INTO BORROW (USER_ID, BORROW_DATE, DUE_DATE)
                OUTPUT INSERTED.ID AS BORROW_ID
                VALUES (@USER_ID, @BORROW_DATE, @DUE_DATE)
            `);

        const borrowId = insertBorrow.recordset[0].BORROW_ID;
        let totalFee = 0;

        for (let book of availableBooks) {
            totalFee += book.BORROW_PRICE;

            await pool.request()
                .input('BORROW_ID', borrowId)
                .input('BOOK_ID', book.ID)
                .input('BOOK_FEE', book.BORROW_PRICE)
                .query(`
                    INSERT INTO BORROW_DETAILS (BORROW_ID, BOOK_ID, QUANTITY, BOOK_FEE)
                    VALUES (@BORROW_ID, @BOOK_ID, 1, @BOOK_FEE)
                `);

            await pool.request()
                .input('BOOK_ID', book.ID)
                .query(`
                    UPDATE BOOKS SET QUANTITY = QUANTITY - 1 WHERE ID = @BOOK_ID
                `);
        }
        await pool.request()
            .input('ID', borrowId)
            .input('FEE', totalFee)
            .query(`
                UPDATE BORROW SET TOTAL_FEE = @FEE WHERE ID = @ID
            `);

        return res.json({
            message: 'Mượn sách thành công',
            borrowId,
            dueDate: dueDate.toISOString().split('T')[0],
            totalFee
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: "Không thể mượn sách" });
    }
};

exports.getBorrowOfme = async (req, res) => {
    let idUser = req.user.userID;
    try {
        let pool = await connection();
        let result = await pool.request()
            .input('idUser', idUser)
            .query(`SELECT  BORROW.ID, USERS.NAMEUSER, BOOKS.NAMEBOOK, BORROW.BORROW_DATE, BORROW.RETURN_DATE,BOOKS.BORROW_PRICE
                FROM BORROW 
                INNER JOIN USERS ON BORROW.USER_ID = USERS.ID
                INNER JOIN BOOKS ON BORROW.BOOK_ID = BOOKS.ID                
                WHERE USER_ID = @idUser`);
        if (result.recordset.length === 0) {
            res.status(404).send({ message: 'Ban ch muon sach nao' });
        }
        res.json(result.recordset);
    } catch (error) {
        console.log(error);
        res.status(500).send({message: 'Khong thuc hien duoc'})
    }
}
exports.returnBook = async (req, res) => {
    const { id_borrow } = req.body;
    const userID = req.user.userID;

    try {
        const pool = await connection();
        const borrowResult = await pool.request()
            .input('id', id_borrow)
            .query(`SELECT * FROM BORROW WHERE ID = @id`);

        if (borrowResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
        }

        const borrow = borrowResult.recordset[0];

        if (borrow.STATUS === 'Đã trả') {
            return res.status(409).json({ message: 'Phiếu mượn này đã được trả' });
        }
        const returnDate = new Date();
        const dueDate = new Date(borrow.DUE_DATE);
        const overdueDays = Math.max(0, Math.floor((returnDate - dueDate) / (1000 * 60 * 60 * 24)));

        const detailResult = await pool.request()
            .input('id', id_borrow)
            .query(`
                SELECT bd.ID AS DETAIL_ID, bd.BOOK_ID, bd.QUANTITY, b.FINE_PER_DAY 
                FROM BORROW_DETAILS bd
                JOIN BOOKS b ON bd.BOOK_ID = b.ID
                WHERE bd.BORROW_ID = @id
            `);

        let totalFine = 0;
        for (const book of detailResult.recordset) {
            const fine = overdueDays * book.FINE_PER_DAY * book.QUANTITY;
            totalFine += fine;
            await pool.request()
                .input('fine', fine)
                .input('id', book.DETAIL_ID)
                .query(`UPDATE BORROW_DETAILS SET FINE = @fine WHERE ID = @id`);
            await pool.request()
                .input('id', book.BOOK_ID)
                .input('quantity', book.QUANTITY)
                .query(`
                    UPDATE BOOKS SET QUANTITY = QUANTITY + @quantity WHERE ID = @id
                `);
        }
        await pool.request()
            .input('returnDate', returnDate)
            .input('fine', totalFine)
            .input('id', id_borrow)
            .query(`
                UPDATE BORROW
                SET STATUS = 'Đã trả', 
                    RETURN_DATE = @returnDate,
                    FINE_TOTAL = @fine
                WHERE ID = @id
            `);
        const returnbooks = await pool.request().query(`SELECT *FROM BORROW WHERE ID = ${id_borrow}`);
        return res.json({
            message: 'Trả sách thành công',
            borrowId: id_borrow,
            returnDate: returnDate.toISOString().split('T')[0],
            fine: totalFine,
            fee: returnbooks.recordset[0].TOTAL_FEE
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Không thể trả sách' });
    }
};

exports.DeleteBorrow = async (req, res) => {
    console.log(req.body);
    let {id} = req.body;
    try {
        let pool = await connection();
        await pool.request()
            .input('id', id)
            .query('DELETE BORROW WHERE ID = @id');
        await pool.request()
            .input('id', id)
            .query(`UPDATE BOOKS SET STATUS = 1 
                    WHERE ID IN (
                        SELECT BK.ID
                        FROM BORROW BR INNER JOIN BOOKS BK ON BK.ID = BR.BOOK_ID
                        WHERE BR.ID = @id 
                    )`)
        res.json({ message: `Xoa thanh cong phieu muon co id ${id}` });
    } catch (error) {
        res.status(500).send({ message: `Khong the xoa sach` });
    }
}