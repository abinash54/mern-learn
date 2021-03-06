const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

//@route GET api/auth
//@desc test route
//@access Public
router.get('/', auth, async (req, res)=>{
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
});


//@route POST api/auth
//@desc authentication 
//@access Public
router.post('/', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').exists(),
], async(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        });
    }

    const { email, password } = req.body;

    try {
        
        //if user exists
        let user = await User.findOne({email});

        if(!user){
            return res.status(400).json({ errors:[{msg:'tur namei nai list t kela'}] });
        }

        //passwd matching
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(403).json({ errors:[{msg:'kun hoi toi harami'}] });
        }
        
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