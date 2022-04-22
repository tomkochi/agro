import style from "./contact.module.scss";
import Header from "../components/guestHeader";
import Link from "next/link";

const Contact = ({ authKey }) => {
	return (
		<div className={style.contact}>
			<Header authKey={authKey}>
				<Link href="/" passHref>
					<a>
						<img src="/images/logo.svg" alt="" />
					</a>
				</Link>
			</Header>
			<div className={style.contents}>
				<div className={style.contentWrapper}>
					<h1>Contact us</h1>
					<form>
						<div className={style.row}>
							<div className={style.inputGroup}>
								<label htmlFor="name">Name</label>
								<input type="text" name="name" id="name" placeholder="Name" />
							</div>
							{/* .inputGroup */}
							<div className={style.inputGroup}>
								<label htmlFor="title">Title</label>
								<input
									type="text"
									name="title"
									id="title"
									placeholder="e.g. Manager"
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
							></textarea>
						</div>
						{/* .inputGroup */}
						<button>Submit</button>
					</form>
				</div>
				{/* .contentWrapper */}
			</div>
			{/* .contents */}
		</div>
	);
};

export default Contact;

export function getServerSideProps(ctx) {
	const { authKey } = ctx.req.cookies;
	if (authKey) {
		return {
			props: { authKey: ctx.req.cookies.authKey || null },
		};
	} else {
		return { props: {} };
	}
}
