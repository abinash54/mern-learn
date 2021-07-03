const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');

const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const Users = require('../../models/User');

//@route GET api/profiles
//@desc get current user profile
//@access private
router.get('/me', auth, async(req, res)=>{
    try{
        const profile = await Profile.findOne({user:req.user.id})
        .populate('user', ['name', 'avatar']);

        if(!profile){
            return res.status(400).json({msg:'profile not found'});
        }


    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
});


//@route GET api/profile/user/:user-id
//@desc get user id's profile
//@access public
router.get('/user/:user_id', async(req, res)=>{
    try{
        //console.log(req.params.user_id)
        const profile = await Profile.findOne({user:req.params.user_id})
        .populate('user', ['name', 'avatar']);

        if(!profile){
            return res.status(400).json({msg:'profile not found'}); 
        }

        res.json(profile);


    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
});


//@route POST api/profiles
//@desc create user profile
//@access private
router.post('/', [auth, [check('status', 'status is requried').not().isEmpty(),
check('skills', 'skills is requried').not().isEmpty(),]],
async(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

     // destructure the request
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook,
    } = req.body;
    
    //getting the fields
    const profileFields = {};
    
    /*profileFields.user = {};*/
    profileFields.user = req.user.id;

    //building profile object
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;

    if(skills){
        profileFields.skills = skills.split(',').map(skl=>skl.trim());
    }

    //building social object
    profileFields.social = {}
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;

    //time to process on those
    try{
        //find a profile and update if found
        let profile = await Profile.findOne({user:req.user.id});
        if(profile){
            //updation
            profile = await Profile.findOneAndUpdate(
                {user:req.user.id},
                {$set:profileFields},
                {new:true}
            );

            return res.json(profile);
        }

        //user not found, so create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);



    }catch(err){
        console.log(err.message);
        res.status(500).send('server error');
    }

     
    res.send('success');

});


//@route GET api/profiles
//@desc get all profiles
//@access public
router.get('/', async(req, res)=>{
    try{    
        const all_profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(all_profiles);
    }catch(err){
        console.log(err.message);
        res.status(500).send('server error');
    }
})


//@route delete api/profiles
//@desc get all profiles
//@access public
router.delete('/', auth, async(req, res)=>{
    try{    
        //removing a profile and user
        await Profile.findOneAndRemove({user:req.user.id});
        await User.findOneAndRemove({_id:req.user.id});

        res.json({msg:'user with profile deleted'});
    }catch(err){
        console.log(err.message);
        res.status(500).send('server error');
    }
});


//@route put api/profiles/experience
//@desc get all
//@access private
router.put('/experience', [auth, [
    check('title', 'title is required').not().isEmpty(),
    check('company', 'company is required').not().isEmpty(),
    check('from', 'from is required').not().isEmpty(),

    ]], 
    async(req,res)=>{
        const err = validationResult(req);
        if(!err.isEmpty()){
            return res.status(400).json({msg:err.array()});
        }

        const{
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }

        try {
            const profile = await Profile.findOne({user:req.user.id});
            
            profile.experience.unshift(newExp);
            
            await profile.save();
            res.json(profile);
        } catch (error) {
            console.log(err.message);
            res.status(500).send('server error');
        }
});

//@route delete api/profiles/experience
//@desc delete experience
//@access private
router.delete('/experience/:exp_id', auth, async(req, res)=>{
    try {
        //const exp_id = req.params.exp_id;
        const profile = await Profile.findOne({ user: req.user.id });
        //console.log(profile.experience);

        //getting the experience array from profile
        const target_exp =  profile.experience
        .map(feature => feature.id)
        .indexOf(req.params.exp_id);

        //delete that experience portion
         profile.experience.splice(target_exp, 1);

        //resaving the profile
        await profile.save();
        res.json(profile);
        


    } catch (error) {
        console.log(error.message);
        res.status(500).send('server error');
    }
});



module.exports = router;