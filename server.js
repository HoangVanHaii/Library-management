const express = require('express');
const app = express();
require('dotenv').config();

const ControllerLibraryRouter = require('./routers/Library');

app.use(express.json());
app.use('/Library', ControllerLibraryRouter);
app.listen(process.env.PORT, () => {
    console.log('server is running at http://localhost:2888/Library');
})