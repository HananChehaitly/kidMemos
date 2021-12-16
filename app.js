const express =  require('express');
const bodyParser = require('body-parser');
const app = express();
const passport = require('passport');
const cookieSession = require('cookie-session');
require('./passport-setup');

const homeRoute = require('./routes/memories');

app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); 
app.use(cookieSession({
    name: 'kidMemos-session',
    keys: ['key1', 'key2']
  }))

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()){
      next();
  } else{
      res.sendStatus(401); 
  }
}

const isGuest = (req, res, next) => {
  if(!req.isAuthenticated()){
      next();
  } else{
      res.redirect('/home'); 
  }
}

app.use(passport.initialize());
app.use(passport.session()); 

app.use('/home', isLoggedIn, homeRoute); 

app.get('/failed', (req, res) => res.send('You failed to authenticate'));

app.get('/login', isGuest, passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    res.redirect('/home');
  });
app.get('/logout', isLoggedIn, (req, res) =>{
    req.session = null;
    req.logout();
    res.redirect('/');
})
module.exports = app;