const User = require("../models/user");
const Comments = require("../models/comments");
const Post = require("../models/model");
exports.register = (req, res) => {
    User.register({
        username: req.body.username
    },
        req.body.password,
        (err, user) => {
            if (err) {
                console.log(err);
            } else {
                user.generateAuthToken();
                passport.authenticate('local')(req, res, () => {
                    console.log("user registered");
                    res.redirect('/');
                });
            }
        });
}

exports.login = (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function (err) {
        if (err) {
            console.log(err);
            res.redirect("/login");
        } else {
            console.log("calling token function")
            user.generateAuthToken();
            console.log("calling token function done")
            res.redirect("/");
        }
    })
}
// posts
exports.createPost = async (req, res) => {
    try {
        const newPost = await new Post({
            title: req.body.postTitle,
            desc: req.body.desc,
            img: req.body.imgLink
        });
        const token = await newPost.generatePostToken();
        const savedPost = await newPost.save();
        res.status(200).redirect("/");
    } catch (error) {
        console.log(error);
        res.status(500).send("server error")
    }
}

exports.updatePost = (req,res)=>{
    Post.findByIdAndUpdate(req.params.id, {
        title:req.body.postTitle,
        desc:req.body.desc,
        img:req.body.imgLink,
    },(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect(`/posts/${req.params.id}`)
        }
    })
};

exports.deletePost = async (req, res) => {
    try {
        const deletedItem = await Post.findByIdAndDelete(req.params.id);
        res.status(200).redirect("/");
    } catch (error) {
        res.status(500).send("server error");
    }
}


// adding comments.
exports.post_comments = async (req, res) => {
    const comment = new Comments({
        username: user.username,
        comment: req.body.comment
    });
    comment.save((err, result) => {
        if (err) {
            console.log(err);
        } else {
            comment.generateCommentToken();
            Post.findById(req.params.id, (err, post) => {
                if (err) {
                    console.log(err);
                } else {
                    // console.log(post.comments)
                    post.comments.push(result);
                    post.save();
                    res.redirect(`/posts/${req.params.id}`)
                }
            })
        }
    });
}

