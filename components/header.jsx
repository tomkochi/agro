import style from "./header.module.scss";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";

const Header = ({ title, authKey, children }) => {
	const router = useRouter();

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
					})
					.catch((e) => {
						console.log(e);
					});
			})
			.catch((e) => {
				console.log(e);
			});
	};

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
					<button className={style.logout} onClick={logout}>
						Logout
					</button>
				</div>
			</div>
			{/* .right */}
		</div>
	);
};

export default Header;
