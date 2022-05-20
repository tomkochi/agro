import style from "./field.module.scss";
import { useState, useEffect } from "react";
import axios from "axios";

const Field = ({ editId, setEditId, field, authKey, resetUser }) => {
	const edit = editId === field._id;
	const [fieldName, setFieldName] = useState(field.name);
	const [busy, setbusy] = useState(false);

	const [errorMessage, setErrorMessage] = useState(null);

	const displayError = (err) => {
		setErrorMessage(err);
		setTimeout(() => {
			setErrorMessage(null);
		}, 3000);
	};

	const updateField = (e) => {
		e.preventDefault();
		setbusy(true);
		axios({
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/field/update`,
			method: "post",
			data: {
				_id: editId,
				name: fieldName,
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
					displayError(r.data.msg.msg);
				}
			})
			.catch((e) => {
				console.log(e);
			})
			.finally(() => {
				setEditId(null);
				setbusy(false);
			});
	};

	const deleteField = (fieldId) => {
		setbusy(true);
		axios({
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/field/delete`,
			method: "post",
			data: {
				_id: fieldId,
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
					displayError(r.data.msg.msg);
				}
			})
			.catch((e) => {
				console.log(e);
			})
			.finally(() => {
				setbusy(false);
			});
	};

	useEffect(() => {
		setFieldName(field.name);
	}, [editId]);

	return (
		<>
			{!edit ? (
				<>
					<div className={style.field}>
						<div className={style.fieldInfo}>
							<h4>{field.name}</h4>
							<h5>{field.acres > 0 ? field.acres : "_"} acres</h5>
						</div>
						{/* .fieldInfo */}
						<div className={style.fieldAction}>
							<button
								onClick={() => setEditId(field._id)}
								disabled={busy || editId}
							>
								<img src="/images/edit.svg" alt="" />
							</button>
							<button
								disabled={busy || editId}
								onClick={() => deleteField(field._id)}
							>
								<img src="/images/trash.svg" alt="" />
							</button>
						</div>
						{/* .fieldAction */}
					</div>
					{errorMessage && (
						<div className={`${style.message} ${style.error}`}>
							{errorMessage}
						</div>
					)}
				</>
			) : (
				<div className={style.editField}>
					<div className={style.header}>
						<h3>Edit field name</h3>
						<button onClick={() => setEditId(null)} disabled={busy}>
							Cancel
						</button>
					</div>
					{/* .header */}
					<form onSubmit={updateField}>
						<input
							type="text"
							placeholder="Name"
							value={fieldName}
							onChange={(e) => setFieldName(e.target.value)}
							disabled={busy}
						/>
						<button disabled={busy}>Save</button>
					</form>
				</div>
			)}
		</>
	);
};

export default Field;
