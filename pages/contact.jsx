import style from "./contact.module.scss";
import Header from "../components/guestHeader";
import Link from "next/link";
import { useState } from "react";

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
					<form name="contact" method="POST" data-netlify="true">
						<input type="hidden" name="form-name" value="contact" />
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
						<input
							type="hidden"
							name="subject"
							value="Enquery from Agrofocal website"
						/>
						<div className={style.bottom}>
							<button type="submit">Submit</button>
						</div>
						{/* .bottom */}
					</form>
				</div>
				{/* .contentWrapper */}
			</div>
			{/* .contents */}
		</div>
	);
};

export default Contact;
