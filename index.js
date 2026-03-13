require("dotenv").config();
const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const authRoutes = require("./routes/auth-routes");
const cors = require("cors");

require("./config/passport-setup");

const port = process.env.PORT || 4000;

app.use(
  session({
    name: "sessionContribute",
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: true,
    maxAge: 3 * 60 * 1000,
    proxy: process.env.NODE_ENV === "production" ? true : false,
    cookie: {
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
      secure: process.env.NODE_ENV === "production" ? true : false,
      // httpOnly : process.env.NODE_ENV === 'production' ? true : false,
    },
  })
);

const origins = ["https://app.contribute.fi", "http://localhost:5173"];

app.options("*", cors());
app.use(
  cors({
    origin: origins,
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// initalize passport
app.use(passport.initialize());
// deserialize cookie from the browser
app.use(passport.session());

app.use("/auth", authRoutes);

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated",
    });
  } else {
    next();
  }
};

app.get("/", authCheck, (req, res) => {
  res.status(200).json({
    authenticated: true,
    message: "user successfully authenticated",
    user: req.user,
    cookies: req.cookies,
  });
});

// connect react to nodejs express server
app.listen(port, () => console.log(`Server is running on port ${port}!`));
