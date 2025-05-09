const express = require('express');
const app = express();

const ControllerLibraryRouter = require('./routers/Library');

app.use(express.json());
app.use('/Library', ControllerLibraryRouter);
app.listen(2888, () => {
    console.log('server is running at http://localhost:2888/Library');
})