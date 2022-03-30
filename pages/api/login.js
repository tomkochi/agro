import cookie from "cookie";

export default (req, res) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("authKey", req.body.authKey, {
      httpOnly: true,
      // secure: process.env.NODE_ENV !== "development",
      secure: true,
      // maxAge: 60 * 60,
      sameSite: "strict",
      path: "/",
    })
  );
  res.statusCode = 200;
  res.json({ success: true });
};
