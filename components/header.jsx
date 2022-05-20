import style from "./header.module.scss";
import Link from "next/link";
import { useState } from "react";
import { userStore } from "../store";
import Sidebar from "../components/sidebar";

const Header = ({ title, authKey, children }) => {
	const [userSideBar, setUserSideBar] = useState(false);

	return (
		<div className={style.header}>
			<div className={style.left}>
				<div className={style.logo}>
					<Link href="/" passHref>
						<a>
							<img src="/images/logo.svg" width={140} alt="" />
						</a>
					</Link>
					<h2>{title}</h2>
				</div>
				{/* .currentPosition */}
			</div>
			{/* .left */}
			<div className={style.right}>
				{children}
				<div className={style.loggedIn}>
					<button className={style.user} onClick={() => setUserSideBar(true)}>
						<img src="/images/user.svg" alt="" />
					</button>
				</div>
			</div>
			{/* .right */}
			{userSideBar && (
				<Sidebar setUserSideBar={setUserSideBar} authKey={authKey} />
			)}
		</div>
	);
};

export default Header;
