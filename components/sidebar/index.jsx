import style from "./index.module.scss";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { userStore } from "../../store";
import Field from "./manage-field";
import Loading from "../loading";

const Sidebar = ({ user, setUser, setUserSideBar, authKey }) => {
	const router = useRouter();

	const wrapperRef = useRef(null);

	const { fields } = userStore((state) => user);

	const [display, setDisplay] = useState("main");
	const [editId, setEditId] = useState(null);
	const [newField, setNewField] = useState("");
	const [busy, setBusy] = useState(false);

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

	const addField = (e) => {
		e.preventDefault();
		setBusy(true);
		axios({
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/field/save`,
			method: "post",
			data: {
				name: newField,
			},
			headers: {
				"Content-type": "application/json",
				authKey,
			},
		})
			.then((r) => {
				console.log(r);
			})
			.catch((e) => {
				console.log(e);
			})
			.finally(() => {
				setDisplay("manage fields");
				setBusy(false);
			});
	};

	// const documentClick = (e) => {
	// 	if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
	// 		// clecked outside
	// 		setUserSideBar(false);
	// 	}
	// };

	// useEffect(() => {
	// 	document.addEventListener("click", documentClick);
	// 	return () => {
	// 		document.removeEventListener("click", documentClick);
	// 	};
	// }, []);

	return (
		<div ref={wrapperRef} className={style.sidebar}>
			{user ? (
				<>
					{display === "main" && (
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
								<div className={style.bottom}>
									<div className={style.action}>
										<button onClick={() => setDisplay("manage fields")}>
											Manage fields
										</button>
									</div>
									<div className={style.action}>
										<Link href="/" passHref>
											<a>Update Password</a>
										</Link>
									</div>
								</div>
								{/* .bottom */}
							</div>
							{/* .bottom */}
						</div>
					)}

					{display === "manage fields" && (
						<div className={style.manageFields}>
							<div className={style.header}>
								<div className={style.left}>
									<button onClick={() => setDisplay("main")}>
										<img src="/images/left-arrow-with-tail.svg" alt="" />
									</button>
									{/* .back */}
									<h4>Manage Fields</h4>
								</div>
								{/* .left */}
								<button
									onClick={() => setDisplay("new field")}
									disabled={editId}
								>
									+ New Field
								</button>
							</div>
							{/* .header */}
							<div className={style.contents}>
								<div className={style.fields}>
									{fields.map((f, i) => {
										return (
											<Field
												key={i}
												editId={editId}
												setEditId={setEditId}
												field={f}
												display={display}
												authKey={authKey}
											/>
										);
									})}
								</div>
								{/* .fields */}
							</div>
							{/* .contents */}
						</div>
					)}

					{display === "new field" && (
						<div className={style.manageFields}>
							<div className={style.header}>
								<div className={style.left}>
									<button onClick={() => setDisplay("manage fields")}>
										<img src="/images/left-arrow-with-tail.svg" alt="" />
									</button>
									{/* .back */}
									<h4>Manage Fields</h4>
								</div>
								{/* .left */}
							</div>
							{/* .header */}
							<div className={style.contents}>
								<div className={style.addField}>
									<div className={style.header}>
										<h3>Add new field</h3>
										<button
											disabled={busy}
											onClick={() => setDisplay("manage fields")}
										>
											Cancel
										</button>
									</div>
									{/* .header */}
									<form onSubmit={addField}>
										<input
											type="text"
											placeholder="New name"
											value={newField}
											onChange={(e) => setNewField(e.target.value)}
											disabled={busy}
										/>
										<button disabled={busy}>Save</button>
									</form>
								</div>
								{/* .addField */}
							</div>
							{/* .contents */}
						</div>
					)}
				</>
			) : (
				<div className={style.loading}>
					<Loading height={15} />
				</div>
			)}
		</div>
	);
};

export default Sidebar;
