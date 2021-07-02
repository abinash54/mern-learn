const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const router = express.Router();

module.exports = function(req, res, next){
    //get token from header
    const token = req.header('x-auth-token');


    //check if no token
    if(!token){
        return res.status(401).json({msg:'no token, auth denied'});

    }

    //verify token
    try{
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user;
        next();
    }catch(err){
        res.status(401).json({msg:'invalid token, auth denied'});
    }
}

