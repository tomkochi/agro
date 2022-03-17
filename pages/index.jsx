import style from "./signin.module.scss";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const Signin = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (email.trim().length === 0 || password.length === 0) {
      alert("Please fill all fields");
      return;
    }
    if (email.trim().length === 0 || password.length === 0) {
      alert("Please fill all fields");
      return;
    }
    axios({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}user/login`,
      method: "post",
      data: {
        email,
        password,
      },
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((r) => {
        if (r.data.msg.code !== 2000) {
          alert(r.data.msg.msg);
          return;
        }
        // setUser(r.data.data.user);
        // setAuthKey(r.data.data.authKey);
        // save user info locally
        localStorage.setItem("user", JSON.stringify(r.data.data.user));
        localStorage.setItem("authKey", JSON.stringify(r.data.data.authKey));
        router.push("/dashboard");
      })
      .catch((e) => {
        alert(e);
      })
      .finally(() => {});
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    if (userInfo) {
      router.push("/dashboard");
    }
  }, []);

  return (
    <div className={style.signin}>
      <div className={style.signinWrapper}>
        <div className={style.image}>
          <img src="/images/logo.svg" alt="" />
        </div>
        {/* .image */}
        <form onSubmit={submit}>
          <input
            type="text"
            name="name"
            autoComplete="username"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            onChange={(e) => setpassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
          <Link href="/dashboard" passHref>
            Forgot Password?
          </Link>
        </form>
      </div>
      {/* .signinWrapper */}
    </div>
  );
};

export default Signin;
