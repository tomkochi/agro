import style from "./login.module.scss";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Loading from "../components/loading";
import { userStore } from "../store";

const Login = () => {
	const router = useRouter();

	const setUser = userStore((state) => state.setUser);

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
				setUser(r.data.data.user.account);
				fetch("/api/login", {
					method: "post",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ authKey: r.data.data.authKey }),
				})
					.then((res) => res.json())
					.then((data) => {
						router.push("/dashboard");
					});
			})
			.catch((e) => {
				alert(e);
				setBusy(false);
			});
	};

	useEffect(() => {
		setUser(null);
	}, []);

	return (
		<div className={style.signin}>
			<div className={style.signinWrapper}>
				<Link href="/" passHref>
					<a className={style.logo}>
						<img src="/images/logo.svg" alt="" />
					</a>
				</Link>
				<form onSubmit={submit}>
					<input
						type="text"
						name="name"
						autoComplete="username"
						onChange={(e) => setEmail(e.target.value)}
						onFocus={(e) => e.target.select()}
						placeholder="Username"
						required
						disabled={busy}
					/>
					<input
						type="password"
						name="password"
						autoComplete="current-password"
						onChange={(e) => setpassword(e.target.value)}
						onFocus={(e) => e.target.select()}
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

export default Login;

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
