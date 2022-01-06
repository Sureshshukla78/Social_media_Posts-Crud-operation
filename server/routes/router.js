const express = require("express");
const route = express.Router();
const controller = require("../controller/controller");
const services = require("../services/services");
const auth = require("../middleware/auth");

/**
 * @description Root Route
 * @method GET/
 */
route.get("/", services.home_route);


/**
 * @description Posts Route
 * @method GET/
 */
route.get('/posts/new', auth ,services.create_post_route)


/**
 * @description show single post Route
 * @method GET/
 */
route.get('/posts/:id', auth ,services.show_single_post);

/**
 * @description update posts Route
 * @method GET/
 */

route.get('/posts/:id/edit', auth ,services.update_post);

/**
 * @description Register Route
 * @method GET/
 */

route.get('/register', services.register_user);

/**
 * @description login Route
 * @method GET/
 */

route.get('/login', services.login_user);

 /**
 * @description login Route
 * @method GET/
 */

route.get('/logout', services.logout_user);

/**
 * 
 * @description for register user
 * @method POST/ register
 */

route.post('/register', controller.register);

/**
 * 
 * @description for login user
 * @method POST/ register
 */

 route.post('/register', controller.login);

/**
 * 
 * @description for create post
 * @method POST/ 
 */

route.post('/posts', auth ,controller.createPost);

/**
 * 
 * @description for update post
 * @method PUT/ 
 */

route.put('/posts/:id', auth ,controller.updatePost);

/**
 * 
 * @description for  delete post
 * @method DELETE/ 
 */

route.delete('/posts/:id', auth ,controller.deletePost);

/**
 * 
 * @description for commenting on post
 * @method POST/
 */

route.post('/posts/:id/comments', auth, controller.post_comments);


module.exports = route;