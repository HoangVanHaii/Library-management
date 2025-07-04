const connectionDB = require('../config/db');

exports.cartShop = async(req, res) =>{
    const {id, quantity} = req.body;
    const user_id = req.user.userID
    if(quantity == 0 || !quantity){
        return res.status(500).send({message: "Không thể thêm sách"})
    }
    try {
        let pool = await connectionDB();
        let check = await pool.request().input('id', id).input('quantity', quantity)
            .query('SELECT *FROM BOOKS WHERE ID = @id AND QUANTITY >= @quantity');
        if(check.recordset.length == 0){
            return res.status(400).send({message: "Số lượng không đủ"});
        }
        await pool.request().input('id', id).input('quantity', quantity).input('user_id', user_id)
            .query('INSERT INTO CART (USER_ID, BOOK_ID, QUANTITY) VALUES(@user_id, @id, @quantity)');
        return res.json({message: "Thêm sách vào giỏ hàng thành công"});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "Server không hoạt động"})
    }
}
exports.getCartShop = async(req, res) => {
    const user_id = req.user.userID;
    try {
        const pool = await connectionDB();
        const result = await pool.request().input('user_id', user_id)
            .query(`SELECT CART.ID as ID_CART, BOOKS.ID as ID_BOOK, BOOKS.COVER_IMAGE, BOOKS.DETAIL, BOOKS.SELL_PRICE, BOOKS.FLASH_PRICE, CART.QUANTITY, BOOKS.NAMEBOOK, BOOKS.AUTHOR, BOOKS.CATEGORY
                FROM CART
                    INNER JOIN BOOKS ON CART.BOOK_ID = BOOKS.ID
                WHERE CART.USER_ID = @user_id`)
        res.json(result.recordset.reverse());
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "Server không hoạt động"})
    }
}
exports.deleteCartShopping = async (req, res) => {
    const { id } = req.body;
    try {
        const pool = await connectionDB();
        await pool.request().input('id', id)
            .query('DELETE CART WHERE ID = @id');
        res.json({message: "Xóa thành công"});
    } catch (error) {
        return res.status(500).send({message: "Server không hoạt động"})
    }
}