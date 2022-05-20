import style from "./index.module.scss";
import axios from "axios";
import { useState } from "react";
import Loading from "../loading";

const UpdatePasswordDisplay = ({ authKey, setDisplay }) => {
	const [oldpassword, setOldpassword] = useState("");
	const [newpassword, setNewpassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [submitMessage, setSubmitMessage] = useState(null);

	const [busy, setBusy] = useState(false);

	const displayMessage = (t, m) => {
		setSubmitMessage({
			type: t,
			message: m,
		});
		setTimeout(() => {
			setSubmitMessage(null);
		}, 3000);
	};

	const updatePassword = (e) => {
		e.preventDefault();
		if (
			newpassword.length === 0 ||
			oldpassword.length === 0 ||
			confirmPassword.length === 0
		) {
			displayMessage("error", "All fields must be filled.");
			return;
		}
		if (newpassword !== confirmPassword) {
			displayMessage("error", "Passwords do not match.");
			return;
		}
		setBusy(true);
		axios({
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/password/update`,
			method: "post",
			data: {
				oldpassword,
				newpassword,
			},
			headers: {
				"Content-type": "application/json",
				authKey,
			},
		})
			.then((r) => {
				if (r.data.success) {
					setOldpassword("");
					setNewpassword("");
					setConfirmPassword("");
					displayMessage("success", r.data.msg.msg);
				} else {
					displayMessage("error", r.data.msg.msg);
				}
			})
			.catch((e) => {
				console.log(e);
			})
			.finally(() => {
				setBusy(false);
			});
	};

	return (
		<div className={style.updatePassword}>
			<div className={style.header}>
				<div className={style.left}>
					<button onClick={() => setDisplay("main")}>
						<img src="/images/left-arrow-with-tail.svg" alt="" />
					</button>
					{/* .back */}
					<h4>Update Password</h4>
				</div>
				{/* .left */}
			</div>
			{/* .header */}
			<form onSubmit={updatePassword}>
				<input
					type="password"
					name="old"
					placeholder="Old password"
					value={oldpassword}
					onChange={(e) => setOldpassword(e.target.value)}
					disabled={busy}
				/>
				<input
					type="password"
					name="new"
					placeholder="New password"
					value={newpassword}
					onChange={(e) => setNewpassword(e.target.value)}
					disabled={busy}
				/>
				<input
					type="password"
					name="confirm"
					placeholder="Confirm password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					disabled={busy}
				/>
				{submitMessage && (
					<div
						className={`${style.message} ${
							submitMessage?.type === "error" ? style.error : ""
						} ${submitMessage?.type === "success" ? style.success : ""}`}
					>
						{submitMessage ? submitMessage.message : ""}
					</div>
				)}
				<button disabled={busy}>
					{busy ? <Loading height={10} /> : "Update"}
				</button>
			</form>
		</div>
	);
};

export default UpdatePasswordDisplay;
