const router = require("express").Router();
const passport = require("passport");
// const CLIENT_HOME_PAGE_URL = "https://app.socket.fi";
const CLIENT_HOME_PAGE_URL = "http://localhost:5173";

// when login is successful, retrieve user info
router.get("/login/success", (req, res) => {
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
router.get("/login/failed", (req, res) => {
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

router.post("/screen-details", async (req, res) => {
  try {
    const { twitterId } = req.body;
    const response = await axios.get(
      `https://api.twitter.com/2/users/${twitterId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch user data");
    }

    const screenName = response.data.data.username; // Extract screen name
    console.log("Twitter Screen Name:", screenName);

    // Optionally send a response back to the client
    res.json({ screenName });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// auth with twitter
router.get("/twitter", passport.authenticate("twitter"));

// redirect to home page after successfully login via twitter
router.get(
  "/twitter/redirect",
  passport.authenticate("twitter", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/auth/login/failed",
  })
);

module.exports = router;
