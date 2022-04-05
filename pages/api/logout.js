import cookie from "cookie";

export default (req, res) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("authKey", "", {
      httpOnly: true,
      // secure: process.env.NODE_ENV !== "development",
      maxAge: 0,
      // sameSite: "none",
      path: "/",
    })
  );
  res.statusCode = 200;
  res.json({ success: true });
};
