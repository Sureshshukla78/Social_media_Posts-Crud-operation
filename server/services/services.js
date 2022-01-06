const Post = require("../models/model");

// home page
exports.home_route = async (req, res) => {
    try {
        const posts = await Post.find({});
        res.render("home", { post: posts });
    } catch (error) {
        console.log(error)
    }
};

// display form for creating a post
exports.create_post_route = async (req, res) => {
    res.render("new-post");
}

// show a single post
exports.show_single_post = async (req, res) => {
    try {
        const post = await Post.findById({ _id: req.params.id }).populate('comments').exec();
        res.render("posts", { postData: post });
    } catch (error) {
        console.log(error)
    }
}

// update a single post
exports.update_post = (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) {
            console.log(err);
        } else {
            post.generatePostToken();
            res.render('edit-post', {post:post});
        }
    });
}

// render register route
exports.register_user = (req, res) => {
    res.render('register');
}

// render login route
exports.login_user = (req, res) => {
    res.render('login');
}

// render logout route
exports.logout_user = (req, res) => {
    req.logout();
    res.redirect('/');
}