const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

//get user model
const User = require('../../models/User');

//@route POST api/users
//@desc test route
//@access Public


router.post('/', [
    check('name', 'Name is required').not().isEmpty(), 
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').isLength({min:6})
], async(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        });
    }

    const { name, email, password } = req.body;

    try {
        
        //if user exists
        let user = await User.findOne({email});

        if(user){
            return res.status(400).json({ errors:[{msg:'User asei kela'}] });
        }

        //get users gravater
        const avatar = gravatar.url(email, {
            s:'200', 
            r:'pg', 
            d:'mm'
        });

        user = new User({
            name, 
            email,
            avatar,
            password
        });

        //encrypt passwd
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save(); //save in database

        //return jsonwebtoken
        const payload = {
            user:{
                id:user.id,

            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            { expiresIn:36000 },
            (err, token)=>{
                if(err) throw err;
                res.json({ token });
            }
        );

        //res.send('user reg success');
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }

});


module.exports = router;