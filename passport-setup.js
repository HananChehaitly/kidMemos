const passport =  require('passport');

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    //User.findById(id, function(err, user) {
      done(null, user);
    //});
  });

passport.use(new GoogleStrategy({
    clientID: "140063580913-tn39h4kso7n95i4purrrqekblj9bucbc.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3000/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    //use profile info (mainly profile.id, profile.email) to check if user is registered in db
    //if not in db register him
    //User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(null, profile);
    //});
  }
));