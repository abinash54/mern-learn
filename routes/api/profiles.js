const express = require('express');
const router = express.Router();

//@route GET api/profiles
//@desc test route
//@access Public


router.get('/', (req, res)=>{
    res.send('profiles route');
});




module.exports = router;