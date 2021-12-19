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
    clientID: "",   //removed ID + Secret to make repo public.
    clientSecret: "",
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