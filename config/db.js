const sql = require('mssql');
require('dotenv').config();
const config = {
    user: process.env.dbUser,
    password: process.env.dbPassword,
    server: process.env.dbServer,
    database: process.env.dbDatabase,
    options: {
        instanceName: process.env.dbInstanceName,
        trustServerCertificate:true
    }
}

const connectionDB = async () => {
    try {
        let pool = await sql.connect(config);
        console.log('ket noi database thanh cong');
        return pool;
    }
    catch (err) {
        console.error(err.message);
        console.log("Không thể kết nối database");
        throw err;
    }
}
module.exports = connectionDB;