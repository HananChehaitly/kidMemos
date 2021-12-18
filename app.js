const express =  require('express');
const bodyParser = require('body-parser');
const app = express();
const passport = require('passport');
const cookieSession = require('cookie-session');
const url = require('./services/url');

require('./passport-setup');
const cors = require('cors');
app.use(cors());

const homeRoute = require('./routes/memories');
const authRoute =  require('./routes/isLoggedin');

app.use(bodyParser.json());
app.use(cors({ origin: url , credentials :  true}));
app.use('/uploads', express.static('uploads')); 
app.use(cookieSession({
    name: 'kidMemos-session',
    keys: ['key1', 'key2']
  }))


const isGuest = (req, res, next) => {
  if(!req.isAuthenticated()){
      next();
  } else{
      res.redirect('/home'); 
  }
}

app.use(passport.initialize());
app.use(passport.session()); 

app.use('/authenticate', authRoute); 
app.use('/api', homeRoute); 

app.get('/failed', (req, res) => res.send('You failed to authenticate'));

app.get('/login', isGuest, passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    res.redirect( url.url + '/home');
  });
app.get('/logout', (req, res) =>{ // add middleware
    req.session = null;
    req.logout();
    res.redirect('/');
})
module.exports = app;