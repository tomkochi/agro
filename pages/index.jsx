import style from "./signin.module.scss";
import Link from "next/link";
import { useState, useEffect } from "react";
import useStore from "../store";
import axios from "axios";
import { useRouter } from "next/router";
import { useAuthSession } from "../utils/auth";

const Signin = () => {
  const router = useRouter();

  const user = useAuthSession();
  if (user) router.push("/dashboard"); //do not render anything

  const authKey = useStore((state) => state.authKey);
  const busy = useStore((state) => state.busy);
  // const user = useStore((state) => state.user);
  const setBusy = useStore((state) => state.setBusy);
  const setAuthKey = useStore((state) => state.setAuthKey);
  const setUser = useStore((state) => state.setUser);

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
    setBusy(true);
    axios({
      url: process.env.NEXT_PUBLIC_BASE_URL,
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
        setUser(r.data.data.user);
        setAuthKey(r.data.data.authKey);
        // save user info locally
        localStorage.setItem("user", JSON.stringify(r.data.data.user));
        localStorage.setItem("authKey", JSON.stringify(r.data.data.authKey));
        router.push("/dashboard");
      })
      .catch((e) => {
        alert(e);
      })
      .finally(() => {
        setBusy(false);
      });
  };

  return (
    <div className={style.signin}>
      busy: {busy ? "Busy" : "Free"}
      <br />
      Auth: {authKey ? authKey : "Nothing"}
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
            disabled={busy}
          />
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            onChange={(e) => setpassword(e.target.value)}
            placeholder="Password"
            required
            disabled={busy}
          />
          <button type="submit" disabled={busy}>
            Login
          </button>
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
