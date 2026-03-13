const passport = require("passport");
const TwitterStrategy = require("passport-twitter");

require("dotenv").config();

const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;

// serialize the user.id to save in the cookie session
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new TwitterStrategy(
    {
      consumerKey: TWITTER_CONSUMER_KEY,
      consumerSecret: TWITTER_CONSUMER_SECRET,
      callbackURL:
        process.env.NODE_ENV === "production"
          ? process.env.CALL_BACK_PROD
          : process.env.CALL_BACK_DEV,
      passReqToCallback: true,
    },
    async (req, token, tokenSecret, profile, done) => {
      try {
        const { clientToken } = req.session.twitter_auth_context;

        let record = {};

        const twitterProfile = {
          name: profile._json.name,
          screenName: profile._json.screen_name,
          age: profile._json.created_at,
          profileImageUrl: profile._json.profile_image_url,
          // twitterAccess: token,
        };
        console.log("session context:", clientToken);
        console.log("ADD TWITTER ACCOUNT LOGIC");

        done(null, record);
      } catch (err) {
        console.error("Error during authentication:", err);
        done(err);
      }
    }
  )
);
