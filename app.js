const express =  require('express');
const bodyParser = require('body-parser');
const app = express();
const passport = require('passport');
const cookieSession = require('cookie-session');
require('./passport-setup');

const postsRoute = require('./routes/posts');

app.use(bodyParser.json());

app.use(cookieSession({
    name: 'kidMemos-session',
    keys: ['key1', 'key2']
  }))

const isLoggedIn = (req, res, next) => {
    if(req.user){
        next();
    } else{
        res.sendStatus(401);
    }
}


app.use(passport.initialize());
app.use(passport.session()); //it tells it to use sessions to manage authentication.

app.use('/posts', isLoggedIn, postsRoute); //this function lets run a function as a middleware.
app.get('/failed', (req, res) => res.send('You failed to authenticate'));
app.get('/good', isLoggedIn ,(req, res) => res.send(`Welcome to home page`));
app.get('/try', isLoggedIn ,(req, res) => res.send(`trial`));

app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  });
app.get('/logout', (req, res) =>{
    req.session = null;
    req.logout();
    res.redirect('/');
})
module.exports = app;