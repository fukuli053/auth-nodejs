const express = require('express');
const volleyball = require('volleyball');
const cors = require('cors');

require('dotenv').config();

// Database Connection
const db = require('./db/connection');

//Auth Middleware
const authMiddleware = require('./auth/middleware');
//Auth Router
const auth = require('./auth');

const app = express();

app.use(volleyball);
app.use(cors({
    origin: 'http://localhost:8080'
}));
app.use(express.json());
app.use(authMiddleware.checkTokenSetUser);

app.get('/', (req, res) => {
    res.json({
        message: "Hello !",
        user: req.user,
    });
});
app.use('/api/auth', auth);

function notFound(req, res, next) {
    res.status(404);
    const error = new Error('Not Found - ' + req.originalUrl);
    next(error);
}

function errorHandler(err, req, res, next) {
    res.status(res.statusCode || 500);
    res.json({
        message: err.message,
        stack: err.stack
    });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port ,() => {
    console.log(`Listening at ${port}`);
});
