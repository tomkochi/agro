import style from "./index.module.scss";
import axios from "axios";
import moment from "moment";
import Dropdown from "../../components/dropdown";

import Layout from "../../components/layout";
import PageHeader from "../../components/header";
import Calendar from "../../components/calendar";
import { useState, useEffect, useRef } from "react";
import { userStore } from "../../store";
import { useRouter } from "next/router";
import Link from "next/link";
// import { useWindowDimensions } from "../../components/useWindowDimension";
//chart
import {
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
	const router = useRouter();

	const user = userStore((state) => state.user); // user from store
	const allFields = { _id: 0, name: "All" }; // for default selection
	const [fields, setFields] = useState([]); // this will be populated in useEffect[user]
	const [selectedFieldFilter, setSelectedFieldFilter] = useState(allFields); // defaultly set to all fields
	const [forecast, setForecast] = useState([]); // data for charts

	const [dayGraphData, setDayGraphData] = useState([]); // data for charts
	const [otherGraphData, setOtherGraphData] = useState([]);

	const [selectedPeriod, setSelectedPeriod] = useState("week"); // 'day', 'month' or 'year'
	const [selectedDate, setSelectedDate] = useState(date); // epoch

	const [dateFromGraph, setDateFromGraph] = useState(date); // date set by clicking the graph

	const [monthData, setMonthData] = useState([]); // which all dates of this month has data
	// const [dateData, setDateData] = useState([]); // selected day's data

	const [yAxisType, setYAxisType] = useState("count");

	const [windowWidth, setwindowWidth] = useState(0); // for calculating chart size

	const [calendar, setCalendar] = useState(false); // whether to show calendar or not
	const calendarWrapper = useRef(null); // mainly for outside click tracking

	const [calendarDisplay, setCalendarDisplay] = useState(null);

	const [barTypes, setBarTypes] = useState([
		{
			type: "ripe",
			show: true,
		},
		{
			type: "full",
			show: true,
		},
		{
			type: "mid",
			show: true,
		},
		{
			type: "small",
			show: true,
		},
		{
			type: "flower",
			show: true,
		},
	]);

	// get which all days has data
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
		setSelectedFieldFilter(f); // the fetching done in useEffect once the filter changed
	};

	const documentClick = (e) => {
		// if the click is outside calendar wrapper
		if (
			calendarWrapper.current &&
			!calendarWrapper.current.contains(e.target)
		) {
			setCalendar(false); // hide calendar
		}
	};

	// This is for making the chart responsive - chart width should be given
	const windowResized = () => {
		setwindowWidth(window.innerWidth);
	};

	const getGraphData = (type, date) => {
		const field =
			selectedFieldFilter.name === "All" ? [] : [selectedFieldFilter._id];
		axios({
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/data/graph`,
			method: "post",
			headers: {
				content_type: "application/json",
				authKey,
			},
			data: {
				date: date,
				field,
				type,
				counttype: yAxisType,
			},
		})
			.then((r) => {
				if (type === "day") {
					setDayGraphData(r.data.data);
				} else {
					setOtherGraphData(r.data.data);
				}
			})
			.catch((e) => {
				console.log(e);
			});
	};

	// [user]
	useEffect(() => {
		// set fields on user change (ie, initially)
		if (user) {
			setFields(user.fields);
		}
	}, [user]);

	// [calendar]
	useEffect(() => {
		// for making the outside click of calendar work
		if (calendar) {
			document.addEventListener("click", documentClick);
		}
		return () => {
			document.removeEventListener("click", documentClick);
		};
	}, [calendar]);

	// [selectedPeriod, selectedFieldFilter, selectedDate]
	useEffect(() => {
		getGraphData("day", dateFromGraph);
		getGraphData(selectedPeriod, selectedDate);
	}, [selectedFieldFilter, selectedDate, yAxisType, selectedPeriod]);

	// [selectedPeriod, selectedFieldFilter, selectedDate]
	useEffect(() => {
		const field =
			selectedFieldFilter.name === "All" ? [] : [selectedFieldFilter._id];
		axios({
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/data/forecast`,
			method: "post",
			headers: {
				content_type: "application/json",
				authKey,
			},
			data: { date: dateFromGraph, field },
		})
			.then((r) => {
				setForecast(r.data.data);
			})
			.catch((e) => {
				console.log(e);
			});
	}, [selectedFieldFilter, selectedDate, dateFromGraph]);

	useEffect(() => {
		setCalendarDisplay({
			year: parseInt(moment(selectedDate).format("YYYY")),
			month: parseInt(moment(selectedDate).format("M")),
		});
	}, [selectedDate]);

	// [router.query]
	useEffect(() => {
		const newDate =
			router.query.d === undefined
				? moment().startOf("day").utc().unix() * 1000
				: parseInt(router.query.d);
		setSelectedDate(newDate);
	}, [router.query]);

	// []
	useEffect(() => {
		windowResized(); // runs initially to get the windowWidth

		window.addEventListener("resize", windowResized); // track window resize
		return () => {
			window.removeEventListener("resize", windowResized);
		};
	}, []);

	// custom legend for day graph
	const dayLegend = (props) => {
		return (
			<div className={style.legend}>
				<ul>
					{barTypes.map((b, i) => {
						return (
							<li key={`item-${i}`}>
								<span style={{ backgroundColor: BarColors[b.type] }}></span>{" "}
								{b.type}
							</li>
						);
					})}
				</ul>
			</div>
		);
	};

	// custom legend for other graphs
	const otherLegend = (props) => {
		return (
			<div className={style.legend}>
				<ul>
					{barTypes.map((b, i) => {
						return (
							<li key={`item-${i}`}>
								<label htmlFor={b.type}>
									<span style={{ backgroundColor: BarColors[b.type] }}></span>
									<input
										type="checkbox"
										checked={b.show}
										id={b.type}
										onChange={() => {
											const tmpTypes = [...barTypes];
											tmpTypes[i].show = !tmpTypes[i].show;
											setBarTypes(tmpTypes);
										}}
									/>
									{b.type}
								</label>
							</li>
						);
					})}
				</ul>
			</div>
		);
	};

	return (
		<Layout
			title={`Chart - ${moment(selectedDate).format("DD MM, YYYY")}`}
			bg="#F3F3F3"
		>
			<div className={style.wrapper}>
				<PageHeader title="Chart" authKey={authKey} />
				<div className={style.chart}>
					<div className={style.dataControls}>
						<div className={style.left}>
							<Link href={`/dashboard?d=${selectedDate}`} passHref>
								<a>
									<img src="/images/left-arrow-with-tail.svg" alt="" />
								</a>
							</Link>
							<div className={style.dropdownWrapper}>
								<Dropdown
									data={[allFields, ...fields]}
									value={selectedFieldFilter}
									onSelection={fieldChange}
									label="Fields"
								/>
							</div>
							{/* .dropdownWrapper */}
							<div className={style.yAxisTypes}>
								<button
									className={yAxisType === "count" ? style.active : ""}
									onClick={() => setYAxisType("count")}
								>
									Count
								</button>
								<button
									className={yAxisType === "acre" ? style.active : ""}
									onClick={() => setYAxisType("acre")}
								>
									Count/Acre
								</button>
							</div>
							{/* .yAxisTypes */}
						</div>
						{/* .left */}
						<div className={style.timeSpan}>
							<div className={style.calendarSelector}>
								{dateFromGraph !== selectedDate && (
									<button
										className={style.resetDate}
										onClick={() => setDateFromGraph(selectedDate)}
									>
										Reset to{" "}
									</button>
								)}
								<button
									className={style.selectedDate}
									disabled={dateFromGraph !== selectedDate}
									onClick={() => setCalendar(true)}
								>
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
											calendarDisplay={calendarDisplay}
											gap={12}
										/>
									</div>
								)}
							</div>
						</div>
						{/* .timeSpan */}
					</div>
					{/* .dataControl */}
				</div>
				<div className={style.chartContainer}>
					{/* DAY CHART */}
					<div className={style.cardWrapper}>
						<div className={style.chartCard}>
							<div className={style.chartHeader}>
								<div className={style.headerLeft}>
									<h4>Yield</h4>
									<h5>{moment(dateFromGraph).format("DD MMM YYYY")}</h5>
								</div>
								{/* .headerLeft */}
							</div>
							{/* .chartHeader */}
							<h6>{yAxisType}</h6>
							<div className={style.chartElm}>
								<BarChart
									data={dayGraphData}
									width={(windowWidth * 30) / 100 - 60}
									height={400}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis
										dataKey={(d) => moment.unix(d.date).format("DD MMM")}
										fontSize={12}
										stroke="#AFAAAA"
									/>
									<YAxis fontSize={12} stroke="#AFAAAA" />
									<Tooltip cursor={{ fill: "transparent" }} />
									<Legend content={dayLegend} layout="vertical" align="right" />
									{barTypes.map((d, i) =>
										d.show ? (
											<Bar
												dataKey={d.type}
												key={i}
												fill={BarColors[d.type]}
												barSize={20}
											/>
										) : null
									)}
								</BarChart>
							</div>
							{/* .chartElm */}
						</div>
						{/* .chartCard */}
					</div>
					{/* .cardWrapper */}

					{/* FORECAST CHART */}
					<div className={style.cardWrapper}>
						<div className={style.chartCard}>
							<div className={style.chartHeader}>
								<div className={style.headerLeft}>
									<h4>Forecast</h4>
									<h5>{moment(selectedDate).format("DD MMM YYYY")}</h5>
								</div>
								{/* .headerLeft */}
							</div>
							{/* .chartHeader */}
							<h6>Forecast for ripe</h6>
							<div className={style.chartElm}>
								<LineChart
									data={dataConvert(forecast, selectedDate)}
									width={(windowWidth * 60) / 100 - 60}
									height={400}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis
										dataKey="date"
										interval={7}
										fontSize={12}
										stroke="#AFAAAA"
									/>
									<YAxis fontSize={12} stroke="#AFAAAA" />
									<Line
										dot={false}
										type="monotone"
										dataKey="value"
										stroke={BarColors.ripe}
										strokeWidth={3}
									/>
								</LineChart>
							</div>
							{/* .chartElm */}
						</div>
						{/* .chartCard */}
					</div>
					{/* .cardWrapper */}
				</div>
				{/* .chartContainer */}
				<div className={style.chartContainer}>
					{/* WEEK/MONTH/YEAR CHART */}
					<div className={style.cardWrapper}>
						<div className={style.chartCard}>
							<div className={style.chartHeader}>
								<div className={style.headerLeft}>
									<h4>Yield</h4>
									<h5>{moment(selectedDate).format("DD MMM YYYY")}</h5>
								</div>
								{/* .headerLeft */}
								<div className={style.headerRight}>
									<div className={style.periodSelector}>
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
								</div>
								{/* .headerRight */}
							</div>
							{/* .chartHeader */}
							<h6>{yAxisType}</h6>
							<div className={style.chartElm}>
								<BarChart
									data={otherGraphData}
									width={windowWidth - 180}
									height={400}
									onClick={(c) => {
										if (c) {
											const newDate = c.activePayload[0].payload.date * 1000;
											setDateFromGraph(newDate);
											getGraphData("day", newDate);
										}
									}}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis
										dataKey={(d) => moment.unix(d.date).format("DD MMM")}
										fontSize={12}
										stroke="#AFAAAA"
									/>
									<YAxis fontSize={12} stroke="#AFAAAA" />
									<Tooltip />
									<Legend
										content={otherLegend}
										layout="vertical"
										align="right"
									/>
									{barTypes.map((d, i) =>
										d.show ? (
											<Bar
												dataKey={d.type}
												key={i}
												fill={BarColors[d.type]}
												barSize={20}
											/>
										) : null
									)}
								</BarChart>
							</div>
							{/* .chartElm */}
						</div>
						{/* .chartCard */}
					</div>
					{/* .cardWrapper */}
				</div>
				{/* .chartContainer */}
			</div>
			{/* .wrapper */}
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

		return {
			props: {
				authKey: authKey || null,
				date:
					d === undefined ? moment().startOf("day").unix() * 1000 : parseInt(d),
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
