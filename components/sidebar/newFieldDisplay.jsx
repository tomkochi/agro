import style from "./index.module.scss";
import { useState } from "react";
import axios from "axios";

const NewFieldDisplay = ({ setDisplay, authKey, resetUser }) => {
	const [busy, setBusy] = useState(false);
	const [newField, setNewField] = useState("");

	const [errorMessage, setErrorMessage] = useState(null);

	const displayError = (err) => {
		setErrorMessage(err);
		setTimeout(() => {
			setErrorMessage(null);
		}, 3000);
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
				if (r.data.success) {
					resetUser();
				} else {
					{
						errorMessage && (
							<div className={`${style.message} ${style.error}`}>
								{errorMessage}
							</div>
						);
					}
				}
			})
			.catch((e) => {
				console.log(e);
			})
			.finally(() => {
				setDisplay("manage fields");
				setBusy(false);
			});
	};

	return (
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
						<button disabled={busy} onClick={() => setDisplay("manage fields")}>
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
	);
};

export default NewFieldDisplay;
