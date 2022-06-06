const express = require('express');
const app = express();

const users = require('./users');

app.use('/users',users);

app.get('/', (req, res) => {
    res.send('JWT Node Js');
})



app.listen(5000);