import style from "./guestHeader.module.scss";
import Link from "next/link";

const GuestHeader = ({ children }) => {
	return (
		<div className={style.guestHeader}>
			<div className={style.left}>{children}</div>
			{/* .left */}
			<div className={style.right}>
				<a href="http://app.agrofocal.ai/login" className={style.login}>
					Login
				</a>
			</div>
			{/* .right */}
		</div>
	);
};

export default GuestHeader;
