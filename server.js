const express = require('express');
const app = express();
require('dotenv').config();

const routerBook = require('./routers/book');
const routerUser = require('./routers/users');
const routerBorrow = require('./routers/borrow');
const routerAuth = require('./routers/auth');

app.use(express.json());
app.use('/Library/books', routerBook);
app.use('/Library/users', routerUser);
app.use('/Library/borrows', routerBorrow);
app.use('/Library/auths', routerAuth);

app.listen(process.env.PORT, () => {
    console.log('server is running at http://localhost:2888/Library');
})