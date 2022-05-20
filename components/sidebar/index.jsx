import style from "./index.module.scss";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Loading from "../loading";
import { userStore } from "../../store";
import ManageFieldsDisplay from "./manageFieldsDisplay";
import NewFieldDisplay from "./newFieldDisplay";
import UpdatePasswordDisplay from "./updatePasswordDisplay";
import MainDisplay from "./mainDisplay";

const Sidebar = ({ authKey, setUserSideBar }) => {
	const wrapperRef = useRef(null);

	const user = userStore((state) => state.user);
	const setUser = userStore((state) => state.setUser);

	const [display, setDisplay] = useState("main");

	const resetUser = () => {
		axios({
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/validate`,
			method: "post",
			data: {
				authKey: authKey,
			},
			headers: {
				content_type: "application/json",
				authKey,
			},
		})
			.then((r) => {
				setUser(r.data.data.user.account);
			})
			.catch((e) => console.log(e));
	};

	const handleEscape = (e) => {
		if (e.key === "Escape") {
			setUserSideBar(false);
		}
	};

	useEffect(() => {
		document.addEventListener("keydown", handleEscape);

		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, []);

	return (
		<div ref={wrapperRef} className={style.sidebar}>
			{user ? (
				<>
					{display === "main" && (
						<MainDisplay
							setDisplay={setDisplay}
							setUserSideBar={setUserSideBar}
							authKey={authKey}
						/>
					)}

					{display === "manage fields" && (
						<ManageFieldsDisplay
							display={display}
							setDisplay={setDisplay}
							authKey={authKey}
							resetUser={resetUser}
						/>
					)}

					{display === "new field" && (
						<NewFieldDisplay
							authKey={authKey}
							setDisplay={setDisplay}
							resetUser={resetUser}
						/>
					)}

					{display === "update password" && (
						<UpdatePasswordDisplay authKey={authKey} setDisplay={setDisplay} />
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
