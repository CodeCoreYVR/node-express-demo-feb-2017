const Express = require('express');
const router = Express.Router();
const db = require('../db/conn');

router.get('/show/:id', function (req, res, next) {
  const id = req.params.id
  db.one(`SELECT * FROM posts WHERE id=$<id>`, {id: id})
    .then(function (post) {
      res.render('posts/show', { post: post });
    })
    .catch(function (err) {
        res.send(err);
    });
})

router.get('/', function (req, res, next) {
  // ORDER BY id DESC will reverse the order of the posts
  db.query(`SELECT * FROM posts ORDER BY id DESC`)
    // terminate a route inside the callback passed to
    // then and catch (e.g. res.send(), res.render())
    .then(function (posts) {
      // res.send is useful to use to simply test if you're
      // receiving the data you want
      // res.send(posts)
      res.render('posts/index', {posts: posts});
    })
    .catch(function (err) {
        res.send(err);
    });
})

router.get('/new', function (req, res, next) {
  res.render('posts/new');
})

router.post('/', function (req, res, next) {
  const post = req.body;
  // res.send(req.body);

  // a post from req.body looks like
  //   {
  //   "title": "fsdfdsfs",
  //   "content": "fdsfsdfsd"
  //   }

  // $<title> refers to the property title of post
  // $<content> refers to the property content of post
  db.query(`
    INSERT INTO posts (title, content) VALUES ($<title>, $<content>)
  `, post
  ).then(function () {
    // .redirect will the browser to instead make another request
    // to the provided url. In this case, it will tell the browser
    // to go to posts index
    res.redirect('/posts')
  }).catch(function (err) { res.send(err) })
})

module.exports = router;









/* */
