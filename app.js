const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit')

const stadiumRouter = require('./routes/stadiumRoutes');

const app = express();

const requestLimiter = rateLimit({
    max: 10,
    message: "there are too many requests, please wait!"
})


app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1/stadiums', requestLimiter);
app.use('/api/v1/stadiums', stadiumRouter);

module.exports = app;
