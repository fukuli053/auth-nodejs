const express = require('express');
const volleyball = require('volleyball');
const cors = require('cors');

// Database Connection
const db = require('./db/connection');

//Auth Router
const auth = require('./auth');

const app = express();

app.use(volleyball);
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: "Hello !",
    });
});

app.use('/api/auth', auth);

const port = process.env.PORT || 5000;
app.listen(port ,() => {
    console.log(`Listening at ${port}`);
});
