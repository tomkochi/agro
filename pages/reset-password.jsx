import style from "./reset-password.module.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

const ResetPassword = () => {
	const router = useRouter();

	const [busy, setBusy] = useState(false);

	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [screen, setScreen] = useState("request");

	const [submitMessage, setSubmitMessage] = useState();

	const [successShown, setSuccessShown] = useState(false);

	let redirectTimer;

	const [redirectTime, setRedirectTime] = useState(5);

	const displayMessage = (t, m) => {
		setSubmitMessage({
			type: t,
			message: m,
		});
		setTimeout(() => {
			setSubmitMessage(null);
		}, 3000);
	};

	const requestOtp = (e) => {
		e.preventDefault();
		if (email.trim().length === 0) {
			return;
		}
		setBusy(true);
		axios({
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/password/forgot`,
			method: "post",
			data: {
				email,
			},
			headers: {
				"Content-type": "application/json",
			},
		})
			.then((r) => {
				if (r.data.success) {
					setScreen("submit");
					displayMessage("success", r.data.msg.msg);
				} else {
					displayMessage("error", r.data.msg.msg);
				}
			})
			.finally(() => setBusy(false));
	};
	const submitOtp = (e) => {
		e.preventDefault();
		if (otp.trim().length === 0) return;
		setBusy(true);
		axios({
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/password/otp/validate`,
			method: "post",
			data: {
				email,
				otp,
			},
			headers: {
				"Content-type": "application/json",
			},
		})
			.then((r) => {
				if (r.data.success) {
					setScreen("update");
					displayMessage("success", "OTP verified");
				} else {
					displayMessage("error", "Invalid OTP");
				}
			})
			.finally(() => setBusy(false));
	};
	const updatePassword = (e) => {
		e.preventDefault();
		if (password.length === 0 || confirmPassword.length === 0) {
			return;
		}
		if (password !== confirmPassword) {
			displayMessage("error", "Passwords do not match");
			return;
		}
		setBusy(true);
		axios({
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/password/forgot/update`,
			method: "post",
			data: {
				email,
				otp,
				newpassword: password,
			},
			headers: {
				"Content-type": "application/json",
			},
		})
			.then((r) => {
				if (r.data.success) {
					setScreen("complete");
					setTimeout(() => {
						setSuccessShown(true);
					}, 1200);
					redirectTimer = setInterval(() => {
						setRedirectTime((o, n) => o - 1);
					}, 1000);
				} else {
					displayMessage("error", r.data.msg.msg);
				}
			})
			.finally(() => setBusy(false));
	};

	useEffect(() => {
		if (redirectTime === 0) {
			setTimeout(() => {
				router.push("/login");
			}, 100);
		}
	}, [redirectTime]);

	useEffect(() => {
		return () => {
			if (redirectTimer) {
				clearInterval(redirectTimer);
			}
		};
	}, []);

	return (
		<div className={style.resetPassword}>
			<header>
				<Link href="/" passHref>
					<a>
						<img src="/images/logo.svg" alt="" />
					</a>
				</Link>
			</header>
			<main>
				{screen === "request" && (
					<div className={style.requestOtp}>
						<h1>Forgot password?</h1>
						<p>Ente your registered email id to recieve OTP</p>
						<form onSubmit={requestOtp}>
							<input
								type="email"
								onChange={(e) => setEmail(e.target.value)}
								name="email"
								placeholder="Email ID"
								required
								disabled={busy}
							/>
							<button disabled={busy}>Get OTP</button>
						</form>
					</div>
				)}

				{screen === "submit" && (
					<div className={style.enterOtp}>
						<h1>OTP</h1>
						<p>
							Enter OTP received to your registered email id
							tinjothomasc@gmail.com
						</p>
						<form onSubmit={submitOtp}>
							<div className={style.otp}>
								<input
									type="text"
									onChange={(e) => setOtp(e.target.value)}
									placeholder="OTP"
									required
									disabled={busy}
								/>
								<button type="button" disabled={busy}>
									Resend
								</button>
							</div>
							{/* .otp */}
							<button type="submit">Continue</button>
						</form>
					</div>
				)}

				{screen === "update" && (
					<div className={style.setPassword}>
						<h1>Set new password</h1>
						<p>
							Your OTP is valid and password has been reset. Please enter new
							password
						</p>
						<form onSubmit={updatePassword}>
							<input
								type="password"
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Password"
								required
								disabled={busy}
							/>
							<input
								type="password"
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder="Confirm password"
								required
								disabled={busy}
							/>
							<button disabled={busy}>Submit</button>
						</form>
					</div>
				)}

				{screen === "complete" && (
					<div className={style.completed}>
						<svg
							width="113"
							height="113"
							viewBox="0 0 113 113"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M110 51.6086V56.5306C109.993 68.0675 106.258 79.2931 99.3499 88.5334C92.4422 97.7736 82.7325 104.533 71.6691 107.804C60.6057 111.076 48.7813 110.683 37.9594 106.685C27.1375 102.686 17.8979 95.2972 11.6186 85.6189C5.33937 75.9406 2.35688 64.4917 3.11597 52.9799C3.87506 41.468 8.33506 30.51 15.8308 21.74C23.3265 12.97 33.4564 6.85792 44.7096 4.3154C55.9628 1.77289 67.7364 2.93612 78.2745 7.63162"
								stroke="#6AAB72"
								strokeWidth="6"
								strokeLinecap="round"
								strokeLinejoin="round"
								class="svg-elem-1"
							></path>
							<path
								d="M110 14L56.9231 68L41 51.8162"
								stroke="#6AAB72"
								strokeWidth="6"
								strokeLinecap="round"
								strokeLinejoin="round"
								class="svg-elem-2"
							></path>
						</svg>

						<div className={`${style.text} ${successShown ? style.shown : ""}`}>
							<h1>You have successfully set new password</h1>
							<p>
								You will be redirected to login page <br />
								in {redirectTime} seconds
							</p>
							<button onClick={() => router.push("/login")}>Login</button>
						</div>
						{/* .text */}
					</div>
				)}

				<div className={style.bottom}>
					<div
						className={`${style.message} ${
							submitMessage?.type === "error" ? style.error : ""
						} ${submitMessage?.type === "success" ? style.success : ""}`}
					>
						{submitMessage ? submitMessage.message : "Message"}
					</div>
				</div>
				{/* .bottom */}
			</main>
		</div>
	);
};

export default ResetPassword;

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
