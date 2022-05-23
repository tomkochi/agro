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

import { serversideValidation } from "../../utils/functions";

//chart
import {
	BarChart,
	CartesianGrid,
	YAxis,
	XAxis,
	Tooltip,
	Legend,
	Bar,
	ScatterChart,
	Scatter,
} from "recharts";

const Chart = ({ authKey, date, userObject }) => {
	const router = useRouter();

	const CHART_HEIGHT = 270;

	const setUser = userStore((state) => state.setUser); // user from store
	const allFields = { _id: 0, name: "All" }; // for default selection
	const [fields, setFields] = useState([]); // this will be populated in useEffect[user]
	const [selectedFieldFilter, setSelectedFieldFilter] = useState(allFields); // defaultly set to all fields
	const [forecast, setForecast] = useState([]); // data for charts

	const [dayGraphData, setDayGraphData] = useState([]); // data for charts
	const [otherGraphData, setOtherGraphData] = useState([]);

	const [selectedPeriod, setSelectedPeriod] = useState("week"); // 'day', 'month' or 'year'
	const [selectedDate, setSelectedDate] = useState(date); // epoch

	const [otherGraphDate, setOtherGraphDate] = useState(date); // other graph data need not be fetched every time the selected date change. Hence this const.

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

	const dateSelected = (date) => {
		setSelectedDate(date);
		setOtherGraphDate(date);
	};

	const forecastRange = () => {
		if (forecast.length === 0) return "";
		const startDate = parseInt(Object.keys(forecast[0])[0]) * 1000;
		const endDate =
			parseInt(Object.keys(forecast[forecast.length - 1])[0]) * 1000;
		const s = moment(startDate).format("DD MMM YYYY");
		const e = moment(endDate)
			.add(forecast.length, "days")
			.format("DD MMM YYYY");
		return `${s} to ${e}`;
	};

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
				let tmp = [];
				r.data.data.map((d) => {
					const localTime = moment.utc(d).local().format("YYYY/MM/DD");
					tmp.push(localTime);
				});
				setMonthData(tmp);
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

	const selectDateFromGraph = (d) => {
		if (d) {
			// if yrar view selected
			if (selectedPeriod === "year") {
				// get month data
				axios({
					url: `${process.env.NEXT_PUBLIC_BASE_URL}/data/month/list`,
					method: "post",
					headers: {
						"Content-Type": "application/json",
						authKey,
					},
					data: {
						date: moment(d.activePayload[0].payload.date * 1000).unix() * 1000,
					},
				})
					.then((r) => {
						let tmp = [];
						r.data.data.map((d) => {
							const localTime = moment.utc(d).local().format("YYYY/MM/DD");
							tmp.push(localTime);
						});
						const firstDay = moment(tmp.sort()[0]).unix() * 1000;
						// set date to the first day of the month
						setSelectedDate(firstDay);
						// getGraphData("month", firstDay);
						setOtherGraphDate(firstDay);
						setSelectedPeriod("month");
					})
					.catch((e) => alert(e));
			} else {
				const newDate = d.activePayload[0].payload.date * 1000;
				setSelectedDate(newDate);
				getGraphData("day", newDate);
			}
		}
	};

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

	// [selectedFieldFilter, selectedDate]
	useEffect(() => {
		getGraphData("day", selectedDate);
		getGraphData(selectedPeriod, otherGraphDate);
	}, [selectedFieldFilter, selectedDate]);

	// [yAxisType]
	useEffect(() => {
		getGraphData("day", selectedDate);
	}, [yAxisType]);

	// [selectedFieldFilter, selectedDate]
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
			data: { date: selectedDate, field },
		})
			.then((r) => {
				setForecast(r.data.data);
			})
			.catch((e) => {
				console.log(e);
			});
	}, [selectedFieldFilter, selectedDate]);

	// [selectedDate]
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
				? moment().startOf("day").unix() * 1000
				: parseInt(router.query.d);
		setSelectedDate(newDate);
		setOtherGraphDate(newDate);
	}, [router.query]);

	// []
	useEffect(() => {
		setUser(userObject);

		setFields(userObject.fields);

		windowResized(); // runs initially to get the windowWidth

		window.addEventListener("resize", windowResized); // track window resize
		return () => {
			window.removeEventListener("resize", windowResized);
		};
	}, []);

	// custom legend for day graph
	const dayLegend = () => {
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
	const otherLegend = () => {
		return (
			<div className={style.legend}>
				<ul>
					{barTypes.map((b, i) => {
						return (
							<li key={`item-${i}`}>
								<label htmlFor={b.type}>
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
									<span style={{ backgroundColor: BarColors[b.type] }}></span>
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
						</div>
						{/* .left */}
						<div className={style.right}>
							<div className={style.yAxisTypes}>
								<button
									className={yAxisType === "count" ? style.active : ""}
									onClick={() => setYAxisType("count")}
								>
									Count
								</button>
								<button
									className={yAxisType === "count/acre" ? style.active : ""}
									onClick={() => setYAxisType("count/acre")}
								>
									Count/Acre
								</button>
							</div>
							{/* .yAxisTypes */}
							<div ref={calendarWrapper} className={style.calendarSelector}>
								<button
									className={style.selectedDate}
									onClick={() => setCalendar(true)}
								>
									<span className={style.date}>
										{moment(selectedDate).format("DD MMM YYYY")}
									</span>
									<span className={style.img}>
										<img src="/images/calendar.svg" alt="" />
									</span>
								</button>
								{calendar && (
									<div className={style.calendarWrapper}>
										<Calendar
											selectedDate={selectedDate}
											setSelectedDate={dateSelected}
											monthData={monthData}
											getMonthData={getMonthData}
											calendarDisplay={calendarDisplay}
											gap={12}
										/>
									</div>
								)}
							</div>
							{/* .calendarSelector */}
						</div>
						{/* .right */}
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
									<h5>{moment(selectedDate).format("DD MMM YYYY")}</h5>
								</div>
								{/* .headerLeft */}
							</div>
							{/* .chartHeader */}
							<h6>{yAxisType}</h6>
							<div className={style.chartElm}>
								<BarChart
									data={dayGraphData}
									width={
										windowWidth < 992
											? windowWidth - 120
											: (windowWidth * 30) / 100 - 60
									}
									height={CHART_HEIGHT}
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
									<h5>{forecastRange()}</h5>
								</div>
								{/* .headerLeft */}
							</div>
							{/* .chartHeader */}
							<h6>Forecast for ripe</h6>
							<div className={style.chartElm}>
								<ScatterChart
									// data={forecast}
									width={
										windowWidth < 992
											? windowWidth - 120
											: (windowWidth * 60) / 100 - 60
									}
									height={CHART_HEIGHT}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis
										dataKey={(d) =>
											moment(parseInt(Object.keys(d)[0]) * 1000).format(
												"DD MMM"
											)
										}
										fontSize={12}
										stroke="#AFAAAA"
									/>
									<YAxis
										dataKey={(d) => Object.values(d)[0]}
										fontSize={12}
										stroke="#AFAAAA"
									/>
									{/* <Line
										dot={false}
										type="monotone"
										dataKey={(d) => Object.values(d)[0]}
										stroke={BarColors.ripe}
										strokeWidth={3}
									/> */}
									<Tooltip cursor={{ strokeDasharray: "3 3" }} />
									<Scatter
										data={forecast}
										fill="#193550"
										stroke="#193550"
										strokeWidth={8}
										line={{ stroke: "#193550", strokeWidth: 1 }}
									/>
								</ScatterChart>
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
									<h5>
										{otherGraphData.length > 0 ? (
											<span>
												{moment(otherGraphData[0].date * 1000).format(
													"DD MMM YYYY"
												)}{" "}
												to{" "}
												{moment(
													otherGraphData[otherGraphData.length - 1].date * 1000
												).format("DD MMM YYYY")}
											</span>
										) : (
											""
										)}
									</h5>
								</div>
								{/* .headerLeft */}
								<div className={style.headerRight}>
									<div className={style.periodSelector}>
										<button
											className={selectedPeriod === "week" ? style.active : ""}
											onClick={() => {
												setSelectedPeriod("week");
												getGraphData("week", otherGraphDate);
											}}
										>
											Week
										</button>
										<button
											className={selectedPeriod === "month" ? style.active : ""}
											onClick={() => {
												setSelectedPeriod("month");
												getGraphData("month", otherGraphDate);
											}}
										>
											Month
										</button>
										<button
											className={selectedPeriod === "year" ? style.active : ""}
											onClick={() => {
												setSelectedPeriod("year");
												getGraphData("year", otherGraphDate);
											}}
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
									width={
										windowWidth < 992 ? windowWidth - 120 : windowWidth - 170
									}
									height={CHART_HEIGHT}
									onClick={(d) => {
										selectDateFromGraph(d);
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
		const date = moment(parseInt(Object.entries(d)[0][0]))
			.add(i, "days")
			.format("DD MMM");
		const value = Object.entries(d)[0][1];
		return (d = { date, value });
	});
};

export function hasDecimal(num) {
	return !!(num % 1);
}

export default Chart;

export async function getServerSideProps(ctx) {
  // disable caching
  ctx.res.setHeader(
		"Cache-Control",
		"public, s-maxage=10, stale-while-revalidate=59"
	);
  
	const res = await serversideValidation(ctx);
	return res;
}
