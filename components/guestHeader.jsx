import style from "./guestHeader.module.scss";
import Link from "next/link";

const GuestHeader = ({ authKey, children }) => {
	return (
		<div className={style.guestHeader}>
			<div className={style.left}>{children}</div>
			{/* .left */}
			<div className={style.right}>
				{authKey ? (
					<Link href="/dashboard" passHref>
						<a className={style.login}>Dashboard</a>
					</Link>
				) : (
					<Link href="/login" passHref>
						<a className={style.login}>Login</a>
					</Link>
				)}
			</div>
			{/* .right */}
		</div>
	);
};

export default GuestHeader;
