import style from "./signin.module.scss";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Loading from "../components/loading";

const Signin = ({ authKey }) => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");

  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
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
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/login`,
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
          setBusy(false);
          return;
        }
        localStorage.setItem("user", JSON.stringify(r.data.data.user));
        // localStorage.setItem("authKey", JSON.stringify(r.data.data.authKey));
        fetch("/api/login", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ authKey: r.data.data.authKey }),
        })
          .then((res) => res.json())
          .then((data) => {
            // console.log(data);
            router.push("/dashboard");
          });
      })
      .catch((e) => {
        alert(e);
        setBusy(false);
      });
  };

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
            {busy ? <Loading height={10} /> : "Login"}
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

export function getServerSideProps(ctx) {
  const { authKey } = ctx.req.cookies;
  if (authKey) {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard",
      },
      props: { authKey: ctx.req.cookies.authKey || null },
    };
  } else {
    return { props: {} };
  }
}
