import style from "./index.module.scss";
import { userStore } from "../../store";
import axios from "axios";
import { useRouter } from "next/router";

const MainDisplay = ({ setDisplay, setUserSideBar, authKey }) => {
	const user = userStore((state) => state.user);
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
				})
					.then(() => {
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
		<div className={style.main}>
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
				<div className={style.action}>
					<button onClick={() => setDisplay("manage fields")}>
						Manage fields
					</button>
				</div>
				<div className={style.action}>
					<button onClick={() => setDisplay("update password")}>
						Update Password
					</button>
				</div>
			</div>
			{/* .bottom */}
		</div>
	);
};

export default MainDisplay;
