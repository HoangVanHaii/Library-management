const e = require('express');
const connectionDB = require('../config/db');
const SenMailToNews = require('../utils/sendOTP')

exports.getOrderOfme = async(req, res) => {
    const id = req.user.userID;
    try {
        let pool = await connectionDB();
        let result = await pool.request().input('id',id)
            .query(`SELECT ORDERS.ID AS ID_ORDER, BOOKS.ID AS ID_BOOK, BOOKS.FLASH_PRICE, BOOKS.SELL_PRICE, BOOKS.NAMEBOOK, ORDERS.TOTAL_PRICE,
                    BOOKS.CATEGORY, BOOKS.AUTHOR, BOOKS.COVER_IMAGE, ORDERS.QUANTITY, BOOKS.DETAIL FROM 
                ORDERS INNER JOIN BOOKS ON BOOKS.ID = ORDERS.BOOK_ID
                WHERE USER_ID = @id`);
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Không thể tìm kiếm"})
    }
}
exports.getbookOrderedByid = async (req, res) => {
    const id = req.params.id;
    try {
        const pool = await connectionDB();
        let result = await pool.request().input('book_id', id)
            .query(`SELECT *FROM ORDERS WHERE BOOK_ID = @book_id`)
        return res.json(result.recordset.length);
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "Không thể lây số lượng sách đã mua"});
    }
}
exports.createOrder  = async (req, res) => {
    const {id, quantity , id_cart, total_price} = req.body;
    const user_id = req.user.userID
    if(quantity == 0 || !quantity){
        return res.status(500).send({message: "Không thể đặt sách"})
    }
    try {
        let pool = await connectionDB();
        let check = await pool.request().input('id', id).input('quantity', quantity)
            .query('SELECT *FROM BOOKS WHERE ID = @id AND QUANTITY >= @quantity');
            console.log('book ', id), typeof(id);
            console.log('quan', quantity, typeof(quantity))
            console.log('check length ',check.recordset.length);
        if(check.recordset.length === 0){
            return res.status(400).send({message: "Số lượng không đủ"});
        }
        await pool.request().input('id', id).input('quantity', quantity).input('user_id', user_id).input('total_price', total_price)
            .query('INSERT INTO ORDERS (USER_ID, BOOK_ID, QUANTITY, TOTAL_PRICE) VALUES(@user_id, @id, @quantity, @total_price)');
        await pool.request().input('id_cart', id_cart)
            .query('DELETE CART WHERE ID = @id_cart');
        await pool.request().input('id', id).input('quantity', quantity)
            .query('UPDATE BOOKS SET QUANTITY = QUANTITY - @quantity WHERE BOOKS.ID =@id')
        return res.json({message: "Mua sách thành công"});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "Server không hoạt động"})
    }
}

exports.SenMailToNews = async(req, res) => {
    const {email} = req.body;
    try {
        console.log(email);
        await SenMailToNews.registerToGiveNews(email);
        res.json({message:"Thành công"});
    } catch (error) {
        return res.status(500).send({message: "Server không hoạt động"})       
    }
}