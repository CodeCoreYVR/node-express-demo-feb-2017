// Step 1: Create a project with `yarn init` (use app.js as entry point)
// Step 2: Add Express package to project `yarn add express`
// Step 3: Require Express in app.js
// Step 4: Create a get route with app.get (takes a path as argument and callback)
//         👇 below for details
// Step 5 (optional): Install nodemon in developement dependencies for auto-reloading
//                    `yarn add -D nodemon`
// Step 6 (optional): Add scripts to start and debug app
// In your package.json, add:
// "scripts": {
//   "start": "nodemon app.js",
//   "debug": "nodemon --inspect app.js"
// },
// Use the scripts by prefixing with yarn such as: yarn start and yarn debug
// This will run the code following script in the context of your node project
// with all your dependencies in your package.json loaded
// Step 7: Add logger middleware, morgan. Install it with `yarn add morgan`,
//         require it with `const logger = require('morgan');` and use it
//         `app.use(logger('dev'));`
// Step 8: Install ejs templating language, `yarn add ejs`. Use it with
//        `app.set('view engine', 'ejs');`
//        To install Atom's ejs syntax highlighting plugin, run:
//        `apm install language-ejs` in your terminal
// Step 9: Install body-parser middleware (form parsing) with `yarn add body-parser`
//         , require it, then use it like below
// Step 10: Serving static assets (e.g. images, css, scripts, etc): Use the middleware
//          Express.static (packaged with Express) to serve them. Do not forget to
//          require the path module of node. Then add the following line to your
//          app.js, `app.use(Express.static(path.join(__dirname, 'public')));
// Step 11: Reading and Sending Cookies: Install cookie-parser middleware with
//          `yarn add cookie-parser`, require it `const cookieParser = require('cookie-parser')`
//          then use it `app.use(cookieParser());`
// Step 12: Create Postgres Database: Make sure your postgres database is installed and
//          working (run `psql` in terminal to see if it's running)
//          - For a postgres database installed with brew:
//            - brew services start postgresql (starts the database; you only need
//              to run this once unless it needs to be restarted)
//          - Create a database with `createdb <name-of-db>` (ie. `createdb ned`)
//          - Drop a database with `dropdb <name-of-db>` (i.e. `dropdb ned`)

const PORT = 5001;
const colors = require('colors');
const path =  require('path');
const Express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// this assigns the right-hand value of module.exports in the file routes/home.js
// to the variable home
const home = require('./routes/home');
const posts = require('./routes/posts');

// Express is a function that returns the object that represents our app or
// web server
// we will use it to configure it and build it before we run it
const app = Express();

// Configure our express app to use the templating engine ejs
// this will only work if you've installed the package with `yarn add ejs`
app.set('view engine', 'ejs');

// We define middleware for our app below
// it's a callback that will receive the request, the response and a next function
// its use to transform or prepare the request and response objects
// example usage including processing the data coming from a form into a usable
// object, logging data from the request to the server logs, setting up user
// authentication for security, etc.

/*
app.use(function (request, response, next) {
  console.log(
    `${request.method}`.cyan.bold,
    request.path,
    request.ip,
    `${new Date()}`.rainbow
  );
  // don't forget to the next function when writing middleware
  // otherwise, your server will stop at the middleware without it
  // next tells express to proceed to the next middleware in line
  next();
  // express process the request & response from middleware to middleware
  // in the order in which they're defined in your code
})
*/

// logger is from the package morgan
// it's function that takes argument to configure how express should log requests
// to the console
// it returns a function (meaning that it's an higher-order function). that function
// is a middleware function
app.use(logger('dev'));

// __dirname is a special global variable made availabe by node. it refers
// to the current directory of the file where its used
// /Users/sg/CodeCore/LiveDemo/node-express.../public
app.use(Express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(function (req, res, next) {
  // cookieParser added the property cookies to the request object
  // req.cookies contains an object where each property maps to a relevant
  // cookie of the same name
  // req.cookies

  // if there isn't a cookie named luckyNumber, set it with a random number
  if (!req.cookies.luckyNumber) {
    // the method .cookie on the response is used to set cookies it takes two
    // required arguments:
    // - the first argument is the name of the cookie as a string
    // - the second argument is value to be stored in the cookie
    res.cookie('luckyNumber', Math.floor(Math.random() * 100), { maxAge: 86400000});
  }

  // You can store arrays and objects in cookies. They will be turned into strings
  // for the browser. When retrieved with req.cookies, the cookieParser will have
  // turned them back into their original type.
  res.cookie('things',['Mouse', 'Pen', 'Bow', 'Dagger']);

  console.log('🤔', req.cookies.things);

  next();
})

// middleware required to transform form data into an easy to use javascript object
app.use(bodyParser.urlencoded({extended: false}));
// this adds the property body to request which contains all the form params

// Any client making a GET request to URL http://localhost:5001/hello-world
// will cause our run the code below

// app.get takes 2 arguments:
// - the first is a url path to match (below means http://localhost:5001/hello-world)
// - the second is a callback function that will be called when a client
//   makes a request to that url path
app.get('/hello-world', function (request, response, next) {
  // To use debugger, run node as `node --inspect app.js`
  // This will show chrome-devtools link in the console. Copy & paste in Chrome
  // then use your app until the line of code where debugger is defined runs
  // debugger;


  // the callback receives 3 arguments:
  // - the request object which is a representation of everything the client is
  //   asking for HTTP headers, HTTP verb, the client's IP, etc
  // - the response object is a presentation of what our server is going to
  //   respond with to the client includes status code (e.g. 200 OK, 301 Redirect, etc)
  //   , HTML for the page, an image, any file, etc
  // -  next is function that tells express to move to the following middleware

  response.send('Hello World!')
})

// HTTP VERB: Get  URL PATH: '/'
/*
app.get('/', function (req, res, next) {
  // the method of the response object, render, renders a template located
  // in the views/ folder as the content of the response to the browser
  res.render('index');
});
*/

app.use('/', home);
// all routes inside of posts
// will begin with /posts
// meaning a route such as router.get('/new', function ...) would
// be accessible at the address /posts/new
app.use('/posts', posts)

app.listen(PORT, function () {
  console.log(`Server listening on http://localhost:${PORT}...`)
});














/* */
