const express = require('express');
const Joi = require('@hapi/joi');       //  for validate data
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/User');

const schema = Joi.object({
    username: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9_]+$'))
        .min(3)
        .max(20)
        .required(),

    password: Joi.string().trim().min(5).required(),
});

const createTokenSendResponse = (user, res, next) => {
    const payload = {
        _id: user._id,
        username: user.username,
    };

    jwt.sign(payload, process.env.TOKEN_SECRET,{
        expiresIn: '1h',
    }, (err, token) => {
        if (err) {
            const error = new Error('Token Error !');
            res.status(422);
            next(error);
        } else {
           res.json({token}); 
        }
    });
}

router.get('/', (req, res) => {
    res.json({
        message: 'selam',
    });
});

// POST /api/auth/signup
router.post('/signup', (req, res, next) => {
    const result = schema.validate(req.body);
    if(!result.error){
        User.findOne({username: req.body.username}, (err, user) => {
            console.log(user);
            // if user is undefined, username is not in db. Otherwise, duplicate username.
            if(user){
                // There is already a user in the db with this username.
                const error = new Error('That username is not OG. Please choose another one.');
                res.status(409);
                next(error);
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    const newUser = new User({username: req.body.username, password: hash});
                    
                    newUser.save((err, user) => {
                        createTokenSendResponse(user, res, next);
                    });
                    
                });
            }
        })
    }else{
        res.status(422);
        next(result.error);
    }
});

// POST /api/auth/login
router.post('/login', (req, res, next) => {
    const result = schema.validate(req.body);
    if(!result.error){
        User.findOne({username: req.body.username}, (err, user) => {
            console.log(user);
            if(user){
                // There is already a user in the db with this username.
                bcrypt.compare(req.body.password, user.password).then((result) => {
                    if (result) {
                        // they sent us right password.
                        createTokenSendResponse(user, res, next);
                    }else{
                        const error = new Error('Wrong password! Please try again.');
                        res.status(422);
                        next(error);
                    }
                });
            } else {
                const error = new Error('We did not find this username in database.');
                res.status(422);
                next(error);
            }
        })
    }else{
        res.status(422);
        next(result.error);
    }
});

module.exports = router;