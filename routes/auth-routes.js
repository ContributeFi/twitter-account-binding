const router = require("express").Router();
const passport = require("passport");
// const CLIENT_HOME_PAGE_URL = "https://app.socket.fi";
// const CLIENT_HOME_PAGE_URL = "http://localhost:5173";
const CLIENT_HOME_PAGE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.CLIENT_HOME_PAGE_PROD
    : process.env.CLIENT_HOME_PAGE_DEV;

console.log("the client home is", CLIENT_HOME_PAGE_URL);
// when login is successful, retrieve user info
router.get("/twitter/success", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies,
    });
  } else {
    //checking timeout issue
    res.status(401).json({
      success: false,
      message: "user is not authenticated xxx",
    });
  }
});

// when login failed, send failed msg
router.get("/twitter/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate.",
  });
});

// When logout, redirect to client
router.get("/logout", (req, res) => {
  req.logout();

  //added to clear cookies
  res.clearCookie("authToken", { path: "/" });

  res.redirect(CLIENT_HOME_PAGE_URL);
});

// auth with twitter
// router.get("/twitter", passport.authenticate("twitter"));

router.get("/twitter", (req, res, next) => {
  req.session.twitter_auth_context = {
    user_id: req.query.user_id,
  };

  // console.log("before auth:", req.query);

  req.session.twitter_auth_context = {
    clientToken: req.query.clientToken,
  };

  console.log("before auth:", req.session.twitter_auth_context);

  passport.authenticate("twitter")(req, res, next);
});

// redirect to home page after successfully login via twitter
router.get(
  "/twitter/redirect",
  passport.authenticate("twitter", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/auth/twitter/failed",
  })
);

module.exports = router;
