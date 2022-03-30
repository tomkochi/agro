import cookie from "cookie";

export default (req, res) => {
  console.log("Starting");
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("authKey", req.body.authKey, {
      httpOnly: true,
      secure: false,
      // secure: process.env.NODE_ENV !== "development",
      // maxAge: 60 * 60,
      sameSite: "none",
      path: "/",
    })
  );
  res.statusCode = 200;
  res.json({ success: true });
};
