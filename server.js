const express = require("express");
const ejs = require("ejs");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const connection = require("./server/database/conn");
const Post = require("./server/models/model");
const User = require("./server/models/user");
const Comments = require("./server/models/comments");
const passport = require("passport");
const passportLocal = require('passport-local');

const session = require("express-session");

const app = express();

// mongodb Connection
mongoose.connect("mongodb://localhost:27017/social-post");


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// authentication config
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    user = req.user;
    next();
});

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// home page
app.get('/', async (req, res) => {
    try {
        const posts = await Post.find({});
        // console.log(posts);
        res.render("home", { post: posts });
    } catch (error) {
        console.log(error)
    }
})
// display form for creating a post
app.get('/posts/new', isLoggedIn, async (req, res) => {
    res.render("new-post");
})

// adding POST route 
app.post('/posts', isLoggedIn, async (req, res) => {
    try {
        const newPost = await new Post({
            title: req.body.postTitle,
            desc: req.body.desc,
            img: req.body.imgLink
        });
        const savedPost = await newPost.save();
        res.status(200).redirect("/");
    } catch (error) {
        console.log(error);
        res.status(500).send("server error")
    }
})

// show a single post
app.get('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById({ _id: req.params.id }).populate('comments').exec();
        res.render("posts", { postData: post });
    } catch (error) {
        console.log(error)
    }
})
// update a single post
app.get('/posts/:id/edit', isLoggedIn, (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) {
            console.log(err);
        } else {
            res.render('edit-post', {post:post});
        }
    });

});

// update route
app.put('/posts/:id', isLoggedIn, (req,res)=>{
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
})

// delelte a single post
app.delete('/posts/:id', async (req, res) => {
    try {
        const deletedItem = await Post.findByIdAndDelete(req.params.id);
        res.status(200).redirect("/");
    } catch (error) {
        res.status(500).send("server error");
    }
});

//authentication routes
app.get('/register', (req, res) => {
    res.render('register.ejs');
})

app.post('/register', (req, res) => {
    User.register({
        username: req.body.username
    },
        req.body.password,
        (err, user) => {
            if (err) {
                console.log(err);
            } else {
                passport.authenticate('local')(req, res, () => {
                    console.log("user registered");
                    // console.log(user);
                    res.redirect('/');
                });
            }
        });
});

// show login form
app.get('/login', (req, res) => {
    res.render('login');
})

// Post login form
app.post('/login', (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function (err) {
        if (err) {
            console.log(err);
            res.redirect("/login");
        } else {
            // console.log("user logged in")
            // console.log(req.user);
            res.redirect("/");
        }
    })
})
// logout route
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

// adding comments
app.post('/posts/:id/comments', isLoggedIn, async (req, res) => {
    const comment = new Comments({
        username: user.username,
        comment: req.body.comment
    });
    comment.save((err, result) => {
        if (err) {
            console.log(err);
        } else {
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
            // console.log(result);
        }
    });
});
// making a midleware to check authentication
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.listen(3000, () => {
    console.log('server started');
})