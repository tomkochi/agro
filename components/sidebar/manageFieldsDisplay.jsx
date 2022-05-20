import style from "./index.module.scss";
import Field from "./field";
import { userStore } from "../../store";
import { useState } from "react";

const ManageFieldsDisplay = ({ display, setDisplay, authKey, resetUser }) => {
	const { fields } = userStore((state) => state.user);
	const [editId, setEditId] = useState(null);

	return (
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
				<button onClick={() => setDisplay("new field")} disabled={editId}>
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
								resetUser={resetUser}
							/>
						);
					})}
				</div>
				{/* .fields */}
			</div>
			{/* .contents */}
		</div>
	);
};

export default ManageFieldsDisplay;
