const connectionDB = require('../config/db');
const sql = require('mssql');


exports.getAllBooks = async (req, res) => {
    try {
        let pool = await connectionDB();
        let result = await pool.request().query(`SELECT *FROM BOOKS`);
        let reversed = result.recordset.reverse();
        res.json(reversed);
    }
    catch (err) {
        res.status(500).send({Message:'Loi server'});
    }
}
exports.getBookById = async (req, res) => {
    try {
        let pool = await connectionDB();
        let id = req.params.id;
        let result = await pool.request()
            .input('id', id)
            .query(`SELECT *FROM BOOKS WHERE ID = @id`);
        if (result.recordset.length === 0) {
            return res.status(404).send({ message: `Khong tim thay book co id = ${id}` });
        }
        res.json(result.recordset[0]);
    }
    catch (err) {
        res.status(500).send({ Message: 'Loi' })
        throw err;
    }
}

exports.UpdateBookById = async (req, res) => {
    let id = req.params.id;
    let { NAMEBOOK, AUTHOR, CATEGORY, PATH, QUANTITY, SELL_PRICE, FLASH_PRICE, DETAIL } = req.body;
    try {
        let pool = await connectionDB();
        let check = await pool.request().input('id',id)
            .query('SELECT *FROM BOOKS WHERE ID = @id');
        
        if(check.recordset.length === 0){
            return res.status(404).send({message: "Không tìm thấy sách"})
        }
        let book = check.recordset[0];
        await pool.request()
            .input('id',id)
            .input('name', NAMEBOOK || book.NAMEBOOK)
            .input('auth', AUTHOR || book.AUTHOR )
            .input('cate', CATEGORY || book.CATEGORY)
            .input('path', PATH || book.COVER_IMAGE)
            .input('quantity', QUANTITY || book.QUANTITY)
            .input('sell_price', SELL_PRICE || book.SELL_PRICE)
            .input('flash_price', FLASH_PRICE || book.FLASH_PRICE)
            .input('detail', DETAIL || book.DETAIL)
            .query(`
                UPDATE BOOKS
                SET 
                    NAMEBOOK = ISNULL(@name, NAMEBOOK),
                    AUTHOR = ISNULL(@auth, AUTHOR),
                    CATEGORY = ISNULL(@cate, CATEGORY),
                    COVER_IMAGE = ISNULL(@path, COVER_IMAGE),
                    QUANTITY = ISNULL(@quantity, QUANTITY),
                    SELL_PRICE = ISNULL(@sell_price, SELL_PRICE),
                    FLASH_PRICE = ISNULL(@flash_price, FLASH_PRICE),
                    DETAIL = ISNULL(@detail, DETAIL)
                WHERE ID = @id;
            `);
        res.json({ message: `Đã cập nhật thành công book có id = ${id}` });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Cập nhật không thành công' });
    }
};


exports.CreateNewBooks = async (req, res) => {
    let {NAMEBOOK, AUTHOR, CATEGORY, PATH, QUANTITY, SELL_PRICE, FLASH_PRICE, DETAIL} = req.body;
    try {
        let pool = await connectionDB();
        let result = await pool.request()
            .input('nameBook', NAMEBOOK)
            .input('author',  AUTHOR)
            .input('category', CATEGORY)
            .input('cover_img', PATH)
            .input('quantity', QUANTITY)
            .input('sell_price', SELL_PRICE)
            .input('flash_price',FLASH_PRICE)
            .input('detail', DETAIL)
            .query(`INSERT INTO BOOKS (NAMEBOOK, AUTHOR, CATEGORY, COVER_IMAGE, QUANTITY, SELL_PRICE, fLASH_PRICE, DETAIL) 
                    VALUES (@nameBook, @author, @category, @cover_img, @quantity, @sell_price, @flash_price, @detail)`);
        res.json({message: "Them thanh cong"});
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: "khong the them moi 1 sach" });
    }
}

exports.DeleteBookByID = async (req, res) => {
    let {id} = req.body;
    try {
        let pool = await connectionDB();
        let check = await pool.request()
            .input('id', id)
            .query(`SELECT *FROM BOOKS
                    INNER JOIN ORDERS ON ORDERS.BOOK_ID = @id`)
        if(check.recordset.length != 0){
            return res.status(400).send({message: "Sách này đang được mượn", });
        }
        await pool.request()
            .input('id', id)
            .query(`
            DELETE BOOKS WHERE ID = @id`);
        res.json({ message: `Xoa thanh cong Book co id = ${id}` });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({message: `Khong the xoa Book co id = ${id}`})
    }
}
exports.DeleteAllBook = async (req, res) => {
    
}
exports.getBookAvailable = async (req, res) => {
    try {
        let pool = await connectionDB();
        let result = await pool.request()
            .query(`
                SELECT *FROM BOOKS WHERE QUANTITY != 0 `)
        
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Khong tim thay sach nao'})
    }
}
exports.searchBook = async (req, res) => {
    let {word, type} = req.body;
    if(typeof(type)=='string'){
        type = type.toUpperCase();
        if(type == 'NAME'){
            type = "NAMEBOOK";
        }
    }
    console.log(word, type);
    try {
        const pool = await connectionDB();
        const result = await pool.request().input('word', `%${word}%`).input('type', type)
            .query(`SELECT *FROM BOOKS WHERE ${type} LIKE @WORD`)
        console.log(result.recordset.length);
        return res.json(result.recordset);

    } catch (error) {
        console.error(error);
        return res.status(500).send({message: "Không thể lọc dữ liệu"});
    }
}
exports.getBookFlashSale = async (req, res) => {
    try {
        const pool = await connectionDB();
        let result = await pool.request().query('SELECT *FROM BOOKS WHERE IS_FLASHSALE = 1');
        res.json(result.recordset);
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Không thể lấy danh sách sale"})
    }
}

exports.getTop10sale = async(req, res) => {
    try {
        const pool = await connectionDB();
        const result = await pool.request().query(`
            SELECT TOP 15 *, 
            ((SELL_PRICE - FLASH_PRICE) / SELL_PRICE) * 100 AS DISCOUNT_PERCENT
            FROM BOOKS 
            ORDER BY DISCOUNT_PERCENT DESC
            `)
        return res.json(result.recordset);
    } catch (error) {
        res.status(500).send({message: "Không thể lấy 10 sách"});
    }
}
exports.setTimeSale = async (req, res) => {
    const start = new Date();
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2 giờ

    try {
        const pool = await connectionDB();
        const result = await pool.request().query('SELECT ID FROM BOOKS');
        const idBook = result.recordset.map(b => b.ID);
        const shuffled = idBook.sort(() => Math.random() - 0.5);
        const flashSaleIds = shuffled.slice(0, 6); // 6 cuốn sale mạnh
        const flashSaleIdsStr = flashSaleIds.join(',');

        await pool.request().query(`
        UPDATE BOOKS 
        SET FLASH_PRICE = SELL_PRICE, 
            IS_FLASHSALE = 0
        `);

        // Giảm nhẹ cho tất cả sách (trừ 5.000)
        await pool.request().query(`
        UPDATE BOOKS 
        SET FLASH_PRICE = CASE 
            WHEN SELL_PRICE >= 5000 THEN SELL_PRICE - 5000 
            ELSE 0 
        END
        `);

        // Giảm mạnh cho 6 sách flash sale (trừ thêm 15.000 nữa)
        await pool.request().query(`
        UPDATE BOOKS 
        SET IS_FLASHSALE = 1,
            FLASH_PRICE = CASE 
                WHEN FLASH_PRICE >= 15000 THEN FLASH_PRICE - 15000 
                ELSE 0 
            END
        WHERE ID IN (${flashSaleIdsStr})
        `);

        // Set thời gian cho 6 sách flash
        await pool.request()
        .input('start', start)
        .input('end', end)
        .query(`
            UPDATE BOOKS 
            SET FLASH_START = @start, FLASH_END = @end 
            WHERE IS_FLASHSALE = 1
        `);
        res.json({ message: 'Đã set Flash Sale thành công!' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Không thể set Flash Sale' });
    }
};
