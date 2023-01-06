const express = require('express');
const morgan = require('morgan');

const stadiumRouter = require('./routes/stadiumRoutes');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1/stadiums', stadiumRouter);

module.exports = app;
