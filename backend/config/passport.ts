import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user"; // Your User Model
import dotenv from "dotenv";
dotenv.config();

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: "http://localhost:5000/auth/google/callback",
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        console.log("Google Profile:", profile); // ✅ Debugging output
  
        let user = await User.findOne({ googleId: profile.id });
  
        if (!user) {
          user = new User({
            googleId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            picture: profile.photos?.[0]?.value, // ✅ Getting profile image
          });
          await user.save();
        }
  
        return done(null, user);
      }
    )
);
  
  
  // ✅ Force email selection before authentication
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account", // ✅ Forces email selection
  });
  

// Serialize User
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize User
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
