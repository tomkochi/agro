import cookie from "cookie";

export default (req, res) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("authKey", req.body.authKey, {
      httpOnly: true,
      // secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 * 24 * 7,
      // sameSite: "none",
      path: "/",
    })
  );
  res.statusCode = 200;
  res.json({ success: true });
};
