import style from "./sidebar.module.scss";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { userStore } from "../store";

const Sidebar = ({ user, setUser, setUserSideBar, authKey }) => {
	const router = useRouter();

	const wrapperRef = useRef(null);

	const { fields } = userStore((state) => user);

	const [display, setDisplay] = useState("main");
	const [editId, setEditId] = useState(null);
	const [newField, setNewField] = useState("");

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

	const addField = () => {
		alert("New field added");
		setDisplay("manage fields");
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
									{fields.map((f) => {
										return (
											<Field
												editId={editId}
												setEditId={setEditId}
												field={f}
												display={display}
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
								<div className={style.editField}>
									<div className={style.header}>
										<h3>Add new field</h3>
										<button onClick={() => setDisplay("manage fields")}>
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
										/>
										<button>Save</button>
									</form>
								</div>
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

export const Field = ({ editId, setEditId, field, display }) => {
	const editable = editId === field._id;
	const [fieldName, setFieldName] = useState(field.name);

	const saveField = () => {
		alert("Field saved");
		setEditId(null);
	};

	useEffect(() => {
		setFieldName(field.name);
	}, [editId]);

	return (
		<>
			{!editable ? (
				<div className={style.field}>
					<div className={style.fieldInfo}>
						<h4>{field.name}</h4>
						<h5>{field.acres} acres</h5>
					</div>
					{/* .fieldInfo */}
					<div className={style.fieldAction}>
						<button onClick={() => setEditId(field._id)}>
							<img src="/images/edit.svg" alt="" />
						</button>
						<button>
							<img src="/images/trash.svg" alt="" />
						</button>
					</div>
					{/* .fieldAction */}
				</div>
			) : (
				<div className={style.editField}>
					<div className={style.header}>
						<h3>Edit field name</h3>
						<button onClick={() => setEditId(null)}>Cancel</button>
					</div>
					{/* .header */}
					<form onSubmit={saveField}>
						<input
							type="text"
							placeholder="Name"
							value={fieldName}
							onChange={(e) => setFieldName(e.target.value)}
						/>
						<button>Save</button>
					</form>
				</div>
			)}
		</>
	);
};

export default Sidebar;
