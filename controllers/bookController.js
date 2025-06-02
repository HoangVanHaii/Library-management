const conectionDB = require('../config/db');

exports.getAllBooks = async (req, res) => {
    try {
        let pool = await conectionDB();
        let result = await pool.request().query('SELECT *FROM BOOKS');
        res.json(result.recordset);
    }
    catch (err) {
        res.status(500).send({Message:'Loi'});
    }
}
exports.getBookById = async (req, res) => {
    try {
        let pool = await conectionDB();
        let id = req.params.id;
        let result = await pool.request()
            .input('id', id)
            .query(`SELECT *FROM BOOKS WHERE ID = @id`);
        if (result.recordset.length === 0) {
            return res.status(404).send({ message: `Khong tim thay book co id = ${id}` });
        }
        res.json(result.recordset);
    }
    catch (err) {
        res.status(500).send({ Message: 'Loi' })
        throw err;
    }
}
exports.UpdateBookById = async (req, res) => {
    try {
        let id = req.params.id;
        let data = req.body;
        let pool = await conectionDB();

        let result2 = await pool.request()
            .input('id', id)
            .input('name', data.NAMEBOOK)
            .input('auth', data.AUTHOR)
            .input('cate', data.CATEGORY)
            .query(`
                UPDATE BOOKS
                SET NAMEBOOK = @name,
                    AUTHOR = @auth,
                    CATEGORY = @cate
                WHERE ID = @id;
            `)
        res.json({message: `Da cap nhat thanh cong book co id = ${id}`});
    }
    catch (Err) {
        console.error(Err);
        res.status(500).send({message: 'update unsucces'})
    }
}

exports.CreateNewBooks = async (req, res) => {
    try {
        let pool = await conectionDB();
        let data = req.body;
        let result = await pool.request()
            .input('nameBook', data.NAMEBOOK)
            .input('author',  data.AUTHOR)
            .input('category', data.CATEGORY)
            .query(`INSERT INTO BOOKS (NAMEBOOK, AUTHOR, CATEGORY) 
                    VALUES (@nameBook, @author, @category)`);
        res.json({message: "Them thanh cong"});
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: "khong the them moi 1 sach" });
    }
}

exports.DeleteBookByID = async (req, res) => {
    let id = req.params.id;
    try {
        let pool = await conectionDB();
        let check = await pool.request()
            .input('id', id)
            .query(`
            SELECT *FROM BOOKS
            WHERE ID = @id;
            `)
        
        if (check.recordset.length === 0) {
            return res.status(404).send({ message: `Khong tim thay Book co id = ${id}` });
        }
        //xoa
        let result = await pool.request()
            .input('id', id)
            .query(`
            DELETE BOOKS WHERE ID = @id`);
        res.json({ message: `Xoa thanh cong Book co id = ${id}` });
    }
    catch (err) {
        res.status(500).send({message: `Khong the xoa Book co id = ${id}`})
    }
}
exports.DeleteAllBook = async (req, res) => {
    try {
        let pool = await conectionDB();
        let result = await pool.request().query(`
            DELETE BOOKS 
            WHERE STATUS = 1
            `)
        res.json({ message: "TOan bo sach chua muon da duoc xoa" });
    }
    catch (e) {
        res.status(500).send({ message: `Loi ${e.message}`})
    }
}
exports.getBookAvailable = async (req, res) => {
    try {
        let pool = await conectionDB();
        let result = await pool.request()
            .query(`
                SELECT *FROM BOOKS WHERE STATUS = 1`)
        let book = result.recordset.map(books => {
            return {
                ...books,
                STATUS: books.STATUS === 0 ? 'Đã Mượn' : 'Chưa Mượn'
            }
        })
        res.json(book);
    } catch (error) {
        console.error(error); // Thêm dòng này để debug lỗi chính xác
        res.status(500).send({message: 'Khong tim thay sach nao'})
    }
}