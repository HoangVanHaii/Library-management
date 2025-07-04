const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const routerBook = require('./routers/book');
const routerUser = require('./routers/users');
const routerBorrow = require('./routers/borrow');
const routerAuth = require('./routers/auth');
const path = require('path')
const uploadRoutes = require('./routers/upload')
const routerOrder = require('./routers/order')
const routerCart = require('./routers/cart')

app.use(cors());
app.use(express.json());
app.use('/Library/books', routerBook);
app.use('/Library/users', routerUser);
app.use('/Library/borrows', routerBorrow);
app.use('/Library/auths', routerAuth);
app.use('/Library/orders', routerOrder);
app.use('/upload', uploadRoutes)
app.use('/Library/carts', routerCart)


app.use('/upload', express.static(path.join(__dirname, 'upload')));

app.use((req, res) => {
    return res.status(404).send({ message: "Route not found" });
})
app.use((err, req, res) => {
    console.error(err);
    return res.status(500).send({ message: "Something went wrong!" });
})
app.listen(process.env.PORT, () => {
    console.log('server is running at http://localhost:2888/Library');
})