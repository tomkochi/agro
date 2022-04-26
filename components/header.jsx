import style from "./header.module.scss";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { userStore } from "../store";
import Loading from "./loading";

const Header = ({ title, authKey, children }) => {
	const user = userStore((state) => state.user);
	const setUser = userStore((state) => state.setUser);

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
				<Sidebar
					user={user}
					setUserSideBar={setUserSideBar}
					authKey={authKey}
					setUser={setUser}
				/>
			)}
		</div>
	);
};

export const Sidebar = ({ user, setUser, setUserSideBar, authKey }) => {
	const router = useRouter();

	const wrapperRef = useRef(null);

	const logout = () => {
		axios({
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/logout`,
			method: "post",
			data: null,
			headers: {
				"Content-type": "application/json",
				authKey,
			},
		})
			.then((r) => {
				fetch("/api/logout", {
					method: "post",
					headers: {
						"Content-Type": "application/json",
						authKey,
					},
					body: JSON.stringify({}),
				})
					.then((res) => res.json())
					.then((data) => {
						router.push("/login");
						setUser(null);
					})
					.catch((e) => {
						console.log(e);
					});
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const documentClick = (e) => {
		if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
			// clecked outside
			setUserSideBar(false);
		}
	};

	useEffect(() => {
		document.addEventListener("click", documentClick);
		return () => {
			document.removeEventListener("click", documentClick);
		};
	}, []);

	return (
		<div ref={wrapperRef} className={style.sidebar}>
			{user ? (
				<>
					<div className={style.top}>
						<div className={style.close}>
							<button onClick={() => setUserSideBar(false)}>
								<img src="/images/close.svg" width={12} alt="" />
							</button>
						</div>
						{/* .close */}
						<div className={style.nameLogout}>
							<h2>{user.user}</h2>
							{/* .userName */}
							<button className={style.logout} onClick={logout}>
								Logout
							</button>
						</div>
						{/* .nameLogout */}
						<div className={style.userInfo}>
							<div className={style.info}>
								<h3>Username</h3>
								<h4>{user.username}</h4>
							</div>
							{/* .userInfo */}
							<div className={style.info}>
								<h3>Membership</h3>
								<h4>{user.membership}</h4>
							</div>
							{/* .userInfo */}
							<div className={style.info}>
								<h3>Crop Types</h3>
								<div className={style.crops}>
									{user.croptype.map((c, i) => {
										return <h4 key={i}>{c.name}</h4>;
									})}
								</div>
								{/* .crops */}
							</div>
							{/* .userInfo */}
						</div>
						{/* .middle */}
					</div>
					{/* .top */}
					<div className={style.bottom}>
						<div className={style.bottom}>
							<div className={style.action}>
								<Link href="/" passHref>
									<a>Manage fields</a>
								</Link>
							</div>
							<div className={style.action}>
								<Link href="/" passHref>
									<a>Update Password</a>
								</Link>
							</div>
						</div>
						{/* .bottom */}
					</div>
				</>
			) : (
				<div className={style.loading}>
					<Loading height={15} />
				</div>
			)}
		</div>
	);
};

export default Header;
