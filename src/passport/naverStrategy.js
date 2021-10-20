const passport = require("passport");
const NaverStrategy = require("passport-naver").Strategy;

const User = require("../models/user");

module.exports = () => {
  passport.use(
    new NaverStrategy(
      {
        clientID: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("access token ::", accessToken);
        console.log("refresh token ::", refreshToken);
        console.log("naver profile ::", profile);
        try {
          const user = await User.findOne({ socialId: profile.id });
          if (user) {
            user.socialId = profile.id;
            await user.save();
            return done(null, user);
          }
          const newUser = await User.create({
            email: profile._json.email,
            name: profile.displayName || "Anonymous",
            socialOnly: true,
            provider: "naver",
            socialId: profile.id,
          });
          return done(null, newUser);
        } catch (error) {
          console.log(error);
          done(error);
        }
      }
    )
  );
};
