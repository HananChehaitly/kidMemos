const passport =  require('passport');
const models =  require('./models') ;

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.dataValues.id);
  });
  
passport.deserializeUser(function (id, done) {
    models.User.findByPk(id).then(user =>{
      done(null, user);
    })
  });

passport.use(new GoogleStrategy({
    clientID: "140063580913-tn39h4kso7n95i4purrrqekblj9bucbc.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3000/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    models.User.findOrCreate({ where: {google_id: profile.id }, 
        defaults: {
                    google_id: profile.id,
                    email:profile.emails[0].value,
                    name: profile.displayName
                }
    }).then(user => {
      return done(null, user[0]); 
    });
    
}
));