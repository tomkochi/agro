import style from "./contact.module.scss";
import Header from "../components/guestHeader";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import Loading from "../components/loading";

const Contact = () => {
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

	const submit = (e) => {
		e.preventDefault();
		const fd = document.getElementById("fd").value;
		if (fd.length > 0) {
			displayMessage("error", "Suspectful activity detected.");
			return;
		}
		const formData = {};
		Object.entries(e.target).map((o) => {
			if (o[1].name) {
				formData[o[1].name] = o[1].value;
			}
		});

		if (
			!formData.name.trim() ||
			!formData.email.trim() ||
			!formData.organisation.trim() ||
			!formData.title.trim() ||
			!formData.message.trim()
		) {
			displayMessage("error", "All fields are required.");
			return;
		}

		setBusy(true);

		axios({
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/contact/form`,
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			data: formData,
		})
			.then((r) => {
				if (r.data.success) {
					displayMessage("success", "Your message has been sent");
					Array.from(document.querySelectorAll("form")[0].elements).forEach(
						(input) => {
							input.value = "";
						}
					);
				} else {
					displayMessage("error", r.data.msg);
				}
			})
			.catch((r) => {
				displayMessage("error", "Something went wrong; try later.");
			})
			.finally(() => {
				setBusy(false);
			});
	};
	return (
		<div className={style.contact}>
			<Header>
				<Link href="/" passHref>
					<a>
						<img src="/images/logo.svg" alt="" />
					</a>
				</Link>
			</Header>
			<div className={style.contents}>
				<div className={style.contentWrapper}>
					<h1>Contact us</h1>
					<form onSubmit={submit}>
						<div className={style.row}>
							<div className={style.inputGroup}>
								<label htmlFor="name">Name</label>
								<input
									type="text"
									name="name"
									id="name"
									placeholder="Name"
									required
									disabled={busy}
								/>
							</div>
							{/* .inputGroup */}
							<div className={style.inputGroup}>
								<label htmlFor="title">Title</label>
								<input
									type="text"
									name="title"
									id="title"
									placeholder="e.g. Manager"
									required
									disabled={busy}
								/>
							</div>
							{/* .inputGroup */}
						</div>
						{/* .row */}
						<div className={style.row}>
							<div className={style.inputGroup}>
								<label htmlFor="email">Email</label>
								<input
									type="text"
									name="email"
									id="email"
									placeholder="hello@mycompany.com"
									required
									disabled={busy}
								/>
							</div>
							{/* .inputGroup */}
							<div className={style.inputGroup}>
								<label htmlFor="organisation">Organisation</label>
								<input
									type="text"
									name="organisation"
									id="organisation"
									placeholder="Organisation"
									required
									disabled={busy}
								/>
							</div>
							{/* .inputGroup */}
						</div>
						{/* .row */}
						<div className={style.inputGroup}>
							<label htmlFor="message">Message</label>
							<textarea
								name="message"
								id="message"
								placeholder="How can we help?"
								required
								disabled={busy}
							></textarea>
						</div>
						{/* .inputGroup */}
						<div className={style.bottom}>
							<div
								className={`${style.message} ${
									submitMessage?.type === "error" ? style.error : ""
								} ${submitMessage?.type === "success" ? style.success : ""}`}
							>
								{submitMessage ? submitMessage.message : "Message"}
							</div>
							<button disabled={busy}>
								{busy ? <Loading height={10} /> : "Submit"}
							</button>
						</div>
						{/* .bottom */}
						<input
							type="text"
							id="fd"
							className={style.fraud}
							tabIndex="-1"
							name="frauddetectioninputtobefilledbybots"
							autoComplete="off"
						/>
					</form>
				</div>
				{/* .contentWrapper */}
			</div>
			{/* .contents */}
		</div>
	);
};

export default Contact;
