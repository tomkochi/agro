import style from "./index.module.scss";
import axios from "axios";
import moment from "moment";
import Dropdown from "../../components/dropdown";

import Layout from "../../components/layout";
import PageHeader from "../../components/header";
import Calendar from "../../components/calendar";
import { useState, useEffect, useRef } from "react";
import { userStore } from "../../store";
// import { useWindowDimensions } from "../../components/useWindowDimension";
//chart
import {
	ResponsiveContainer,
	BarChart,
	CartesianGrid,
	YAxis,
	XAxis,
	Tooltip,
	Legend,
	Bar,
	LineChart,
	Line,
} from "recharts";

const Chart = ({ authKey, date }) => {
	const user = userStore((state) => state.user);
	const allFields = { _id: 0, name: "All" };
	const [fields, setFields] = useState([]);
	const [selectedFieldFilter, setSelectedFieldFilter] = useState(allFields);
	const [bardata, setBardata] = useState([]);
	const [forecast, setForecast] = useState([]);

	const [selectedPeriod, setSelectedPeriod] = useState("day");
	const [selectedDate, setSelectedDate] = useState(date / 1000);

	const [monthData, setMonthData] = useState([]); // which all dates of this month has data
	const [dateData, setDateData] = useState([]); // selected day's data

	const [windowWidth, setwindowWidth] = useState(0);

	const [calendar, setCalendar] = useState(false);
	const calendarWrapper = useRef(null);

	const fetchDateData = (date, hasData) => {
		if (!hasData) {
			setDateData([]);
			return;
		}

		setBusy(true);

		axios({
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/data/list`,
			method: "post",
			headers: {
				"Content-Type": "application/json",
				authKey,
			},
			data: {
				date,
				field: selectedFieldFilter._id === 0 ? [] : [selectedFieldFilter._id],
			},
		})
			.then((r) => {
				setDateData(r.data.data);
			})
			.catch((e) => {
				// console.log(e);
			})
			.finally(() => {
				setBusy(false);
			});
	};
	const getMonthData = (date) => {
		axios({
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/data/month/list`,
			method: "post",
			headers: {
				"Content-Type": "application/json",
				authKey,
			},
			data: {
				date: date,
			},
		})
			.then((r) => {
				setMonthData(r.data.data);
			})
			.catch((e) => alert(e));
	};

	const fieldChange = (f) => {
		setSelectedFieldFilter(f);
	};

	const documentClick = (e) => {
		if (
			calendarWrapper.current &&
			!calendarWrapper.current.contains(e.target)
		) {
			setCalendar(false);
		}
	};

	const windowResized = () => {
		setwindowWidth(window.innerWidth);
	};

	useEffect(() => {
		if (user) {
			setFields(user.account.fields);
		}
	}, [user]);

	useEffect(() => {
		if (calendar) {
			document.addEventListener("click", documentClick);
		}
		return () => {
			document.removeEventListener("click", documentClick);
		};
	}, [calendar]);

	useEffect(() => {
		const field =
			selectedFieldFilter.name === "All" ? [] : [selectedFieldFilter._id];

		axios({
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/data/graph`,
			method: "post",
			headers: {
				content_type: "application/json",
				authKey,
			},
			data: { date: selectedDate, field, type: selectedPeriod },
		})
			.then((r) => {
				console.log(r);
				setBardata(r.data.data);
			})
			.catch((e) => {
				console.log(e);
			});
	}, [selectedPeriod, selectedFieldFilter, selectedDate]);

	useEffect(() => {
		const field =
			selectedFieldFilter.name === "All" ? [] : [selectedFieldFilter._id];

		if (selectedPeriod == "day") {
			axios({
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/data/forecast`,
				method: "post",
				headers: {
					content_type: "application/json",
					authKey,
				},
				data: { date: selectedDate, field },
			})
				.then((r) => {
					console.log(r);
					setForecast(r.data.data);
					console.log(dataConvert(forecast));
				})
				.catch((e) => {
					console.log(e);
				});
		}
	}, [selectedPeriod, selectedFieldFilter, selectedDate]);

	useEffect(() => {
		windowResized();

		getMonthData(moment(selectedDate).utc().unix() * 1000);

		window.addEventListener("resize", windowResized);
		return () => {
			window.removeEventListener("resize", windowResized);
		};
	}, []);

	return (
		<Layout
			title={`Chart - ${moment(selectedDate).format("DD MM, YYYY")}`}
			bg="#F3F3F3"
		>
			<PageHeader title={"Chart"} authKey={authKey}></PageHeader>
			<div className={style.chart}>
				<div className={style.dataControls}>
					<div className={style.dropdownWrapper}>
						<Dropdown
							data={[allFields, ...fields]}
							value={selectedFieldFilter}
							onSelection={fieldChange}
						/>
					</div>
					{/* .dropdownWrapper */}
					<div className={style.timeSpan}>
						<div className={style.calendarSelector}>
							<button onClick={() => setCalendar(true)}>
								{moment(selectedDate).format("DD MMM YYYY")}
								<span>
									<img src="/images/calendar.svg" alt="" />
								</span>
							</button>
							{calendar && (
								<div ref={calendarWrapper} className={style.calendarWrapper}>
									<Calendar
										selectedDate={selectedDate}
										setSelectedDate={setSelectedDate}
										monthData={monthData}
										getMonthData={getMonthData}
										fetchDateData={fetchDateData}
										gap={12}
									/>
								</div>
							)}
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
			<div className={style.chartContainer}>
				<div className={style.chartCard}>
					<ResponsiveContainer height="100%">
						<BarChart data={bardata} width={windowWidth / 2 - 60} height={200}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey={(d) => moment.unix(d.date).format("DD MMM")} />
							<YAxis />
							<Tooltip />
							<Legend />
							<Bar dataKey="ripe" fill={BarColors.ripe} />
							<Bar dataKey="full" fill={BarColors.full} />
							<Bar dataKey="mid" fill={BarColors.mid} />
							<Bar dataKey="small" fill={BarColors.small} />
							<Bar dataKey="flower" fill={BarColors.flower} />
						</BarChart>
					</ResponsiveContainer>
				</div>
				{selectedPeriod == "day" ? (
					<div className={style.chartCard}>
						<ResponsiveContainer height="100%">
							<LineChart
								data={dataConvert(forecast, selectedDate)}
								width={windowWidth / 2 - 60}
								height={200}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" interval={7} />
								<YAxis />
								<Line
									dot={false}
									type="monotone"
									dataKey="value"
									stroke={BarColors.ripe}
									strokeWidth={3}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				) : null}
			</div>
			{/* .chart */}
		</Layout>
	);
};

export const BarColors = {
	ripe: "#EA4335",
	full: "#FF9900",
	mid: "#E6B8AF",
	small: "#50B46B",
	flower: "#FCE5CD",
	total: "#069A8E",
};

export const dataConvert = (data, selectedDate) => {
	return data.map((d, i) => {
		let date = moment(selectedDate).add(i, "days").format("DD MMM");
		return (d = { date: date, value: d });
	});
};

export function hasDecimal(num) {
	return !!(num % 1);
}

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
