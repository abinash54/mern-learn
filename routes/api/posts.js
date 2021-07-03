const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');

//@route POST api/post
//@desc test route
//@access Public
router.post('/', [
    auth,
    [
        check('text', 'Text is required').not().isEmpty(),

    ]
],async(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    
    try {
        const user = await User.findById(req.user.id).select('-password');
        const newPost = new Post({
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
        });

        const post = await newPost.save();

        res.json(post);

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'server error'});
    }
});



//@route GET api/posts
//@desc get all posts
//@access private
router.get('/', auth, async(req, res)=>{
    try {
        const allPosts = await Post.find().sort({date:-1});
        res.json(allPosts);
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'server error'});
    }
});



//@route GET api/posts/:id
//@desc get post by ID
//@access private
router.get('/:id', auth, async(req, res)=>{
    try {
        const allPosts = await Post.findById(req.params.id);
        if(!allPosts){
            return res.status(400).json({msg:'no posts are there'});
            
        }

        res.json(allPosts);
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'server error'});
    }
});


//@route DELETE api/posts/:id
//@desc delete post by ID
//@access private
router.delete('/:id', auth, async(req, res)=>{
    try {
        //getting the post by id
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(400).json({msg:'no posts are there'});
            
        }

        //check about user
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg:'unauthorized access'});
        }

        await post.remove();

        res.json({msg:'post deleted successfuly'});
    } catch (error) {
        
        console.log(error);
        res.status(500).json({msg:'server error'});
    }
});


//@route PUT api/posts/like/:id
//@desc like post
//@access private
router.put('/like/:id', auth, async(req, res)=>{
    try {
        //get the post
        const post = await Post.findById(req.params.id);

        //does this user already liked?
        if(post.likes.filter(like=>like.user.toString() === req.user.id).length > 0
        ){
            return res.status(401).json({msg:'post liked'});
        }

        //if not liked, add him
        post.likes.unshift({user:req.user.id});
        await post.save();

        return res.json(post.likes);

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'server error'});
    }
});


//@route PUT api/posts/unlike/:id
//@desc unlike post
//@access private
router.put('/unlike/:id', auth, async(req, res)=>{
    try {
        //get the post
        const post = await Post.findById(req.params.id);

        //does this user already liked?
        if(post.likes.filter(like=>like.user.toString() === req.user.id).length == 0
        ){
            return res.status(401).json({msg:'like the post first, buddy'});
        }

        //get remove index
        const removeIdx = post.likes.map(like=>like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIdx,1);

        return res.json(post.likes);

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'server error'});
    }
});


//@route POST api/post/comment/:id
//@desc test route
//@access private
router.post('/comment/:id', [
    auth,
    [
        check('text', 'Text is required').not().isEmpty(),

    ]
],async(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    
    try {
        const user = await User.findById(req.user.id).select('-password');
        const post  = await Post.findById(req.params.id);

        const newComment = {
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
        };

        post.comments.unshift(newComment);
        await post.save();

        res.json(post.comments);

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'server error'});
    }
});


//@route DELETE api/post/comment/:pid/:cid
//@desc delete a comment in a post
//@access private
router.delete('/comment/:pid/:cid', auth, async (req, res)=>{
    try {
        //get the post
        const post = await Post.findById(req.params.pid);
        //get comment
        const comment = post.comments.find(comm=>comm.id === req.params.cid);
        if(!comment)
            return res.status(404).json({msg:'comment not found'});

        //verify user
        if(comment.user.toString() !== req.user.id)
            return res.status(401).json({msg:'unauthorized access'});

        //get the index of removal
        const rmIndx = post.comments.map(comment =>comment.user.toString()).indexOf(req.user.id);

        post.comments.splice(rmIndx, 1);
        await post.save();

        res.json(post.comments);

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'server error'});
    }
});


module.exports = router;