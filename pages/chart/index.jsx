import style from "./index.module.scss";
import axios from "axios";
import moment from "moment";
import Dropdown from "../../components/dropdown";

import Layout from "../../components/layout";
import PageHeader from "../../components/header";
import Calendar from "../../components/calendar";
import { useState, useEffect } from "react";
import { userStore } from "../../store";

const Chart = ({ authKey, date }) => {
	const user = userStore((state) => state.user);

	const allFields = { _id: 0, name: "All" };
	const [fields, setFields] = useState([]);
	const [selectedFieldFilter, setSelectedFieldFilter] = useState(allFields);

	const [selectedPeriod, setSelectedPeriod] = useState("day");

	// useEffect(() => {
	// 	if (user) {
	// 		setFields(user.account.fields);
	// 	}
	// }, [user]);

	useEffect(() => {
		axios({
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/data/graph`,
			method: "post",
			headers: {
				content_type: "application/json",
				authKey: "agroQ1dr$sA",
			},
			data: { date: date / 1000, field: [], type: selectedPeriod },
		})
			.then((r) => {
				console.log(r);
			})
			.catch((e) => {
				console.log(e);
			});
	}, []);

	return (
		<Layout
			title={`Chart - ${moment(date / 1000).format("DD MM, YYYY")}`}
			bg="#F3F3F3"
		>
			<PageHeader title={"Chart"} authKey={authKey}></PageHeader>
			<div className={style.chart}>
				<div className={style.dataControls}>
					<div className={style.dropdownWrapper}>
						<Dropdown
							data={[allFields, ...fields]}
							value={selectedFieldFilter}
							onSelection={() => {}}
							cb={() => {}}
						/>
					</div>
					{/* .dropdownWrapper */}
					<div className={style.timeSpan}>
						<div className={style.calendarSelector}>
							<button>
								{moment(date / 1000).format("DD MMM YYYY")}
								<span>
									<img src="/images/calendar.svg" alt="" />
								</span>
							</button>
							<div className={style.calendarWrapper}>
								<Calendar
									selectedDate={date / 1000}
									setSelectedDate={null}
									monthData={[]}
									getMonthData={null}
									fetchDateData={null}
									gap={12}
								/>
							</div>
							{/* .calendarWrapper */}
						</div>
						{/* .calendarSelector */}
						<div className={style.periodSelector}>
							<button
								className={selectedPeriod === "day" ? style.active : ""}
								onClick={() => setSelectedPeriod("day")}
							>
								Day
							</button>
							<button
								className={selectedPeriod === "week" ? style.active : ""}
								onClick={() => setSelectedPeriod("week")}
							>
								Week
							</button>
							<button
								className={selectedPeriod === "month" ? style.active : ""}
								onClick={() => setSelectedPeriod("month")}
							>
								Month
							</button>
							<button
								className={selectedPeriod === "year" ? style.active : ""}
								onClick={() => setSelectedPeriod("year")}
							>
								Year
							</button>
						</div>
						{/* .periodSelector */}
					</div>
					{/* .timeSpan */}
				</div>
				{/* .dataControl */}
			</div>
			{/* .chart */}
		</Layout>
	);
};

export default Chart;

export async function getServerSideProps(ctx) {
	const { authKey } = ctx.req.cookies;
	if (authKey) {
		let { d } = ctx.query;
		if (!d) {
			d = moment().startOf("day").unix();
		}

		return {
			props: {
				authKey: authKey || null,
				date: d * 1000,
			},
		};
	} else {
		return {
			redirect: {
				permanent: false,
				destination: "/login",
			},
			props: {},
		};
	}
}
