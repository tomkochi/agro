import style from "./calendar.module.scss";
import { datesGenerator, daysInMonth } from "dates-generator";
import { useEffect, useState } from "react";
import Image from "next/image";
import moment from "moment";
import { useRouter } from "next/router";

const Calendar = ({
	selectedDate,
	setSelectedDate,
	monthData = [],
	getMonthData,
	fetchDateData,
	calendarDisplay = null,
	gap = 18,
}) => {
	const router = useRouter();

	const monthAction = {
		TO: 0,
		NEXT: 1,
		PREVIOUS: 2,
	};
	Object.freeze(monthAction);

	const [dates, setDates] = useState([]); // date array for the whole month

	const [busy, setBusy] = useState(false);

	const [display, setDisplay] = useState(
		calendarDisplay || {
			year: parseInt(moment().format("YYYY")),
			month: parseInt(moment().format("M")),
		}
	);

	const [yearMonthSelector, setYearMonthSelector] = useState(false);

	const years = () => {
		const startYear = 2021;
		const endYear = parseInt(moment().format("YYYY"));
		return Array.from(
			{ length: endYear - startYear + 1 },
			(_, i) => i + startYear
		);
	};

	const months = () => {
		return moment.months();
	};

	const changeMonth = (action) => {
		let newMonth;
		if (action === monthAction.NEXT) {
			newMonth = moment(
				`${display.year}/${display.month}/01`,
				"YYYY/MM/DD"
			).add(1, "month");
		}
		if (action === monthAction.PREVIOUS) {
			newMonth = moment(
				`${display.year}/${display.month}/01`,
				"YYYY/MM/DD"
			).subtract(1, "month");
		}
		const year = parseInt(moment(newMonth).format("YYYY"));
		const month = parseInt(moment(newMonth).format("MM"));
		setDisplay({
			year,
			month,
		});
		displayCalendar(year, month);
		getMonthData(moment(`${year}/${month + 1}/01`, "YYYY/MM/DD").unix() * 1000);
	};

	const hasData = (d) => {
		if (monthData.length === 0) return false;
		const date = moment({ year: d.year, month: d.month, day: d.date }).format(
			"YYYY/MM/DD"
		);
		return monthData.includes(date);
	};

	const displayCalendar = (year, month) => {
		const body = {
			year: year,
			month: month - 1,
		};
		const { dates } = datesGenerator(body);
		setDates([...dates]);
	};

	// new date click event
	const selectNewDate = (date) => {
		if (moment(date).isAfter(new Date(), "day")) return false;

		const dateString = `${date.date}/${date.month + 1}/${date.year}`;
		const dateNumber = moment(dateString, "D/M/YYYY").unix() * 1000;
		setSelectedDate(dateNumber);
		const newDate = moment(dateNumber).format("YYYY/MM/DD");
		router.push(
			{
				pathname: router.pathname,
				query: { d: dateNumber },
			},
			undefined,
			{ shallow: true }
		);
	};

	const selectYear = (y) => {
		setDisplay((d) => {
			getMonthData(
				moment(`${y}/${d.month + 1}/01`, "YYYY/MM/DD")
					.startOf("month")
					.unix() * 1000
			);
			return {
				year: y,
				month: d.month,
			};
		});
		displayCalendar(y, display.month);
	};
	const selectMonth = (m) => {
		setDisplay((d) => {
			getMonthData(
				moment(`${d.year}/${m + 2}/01`, "YYYY/MM/DD")
					.startOf("month")
					.unix() * 1000
			);
			return {
				year: d.year,
				month: m + 1,
			};
		});
		displayCalendar(display.year, m + 1);
	};

	const handleOutsideClick = (e) => {
		setYearMonthSelector(false);
	};

	// yearMonthSelector
	useEffect(() => {
		if (yearMonthSelector) {
			document.addEventListener("click", handleOutsideClick);
		}
		return () => {
			document.removeEventListener("click", handleOutsideClick);
		};
	}, [yearMonthSelector]);

	useEffect(() => {
		displayCalendar(display.year, display.month);
	}, [display]);

	useEffect(() => {
		getMonthData(selectedDate);
	}, []);

	return (
		<div className={style.calendar}>
			<div className={style.controls} style={{ marginBottom: gap }}>
				<button
					onClick={() => changeMonth(monthAction.PREVIOUS)}
					className={style.previousMonth}
					disabled={busy}
				>
					<Image
						src="/images/left-arrow-outline-green.svg"
						alt=""
						width={8}
						height={14}
					/>
				</button>
				<div className={style.yearMonth}>
					<button
						className={`${style.monthAndYear} ${
							yearMonthSelector ? style.open : ""
						}`}
						onClick={() => setYearMonthSelector(true)}
						disabled={busy}
					>
						{moment(display.month, "M").format("MMMM")} {display.year}
					</button>
					{yearMonthSelector && (
						<div className={style.customYearMonth}>
							<div className={style.years}>
								{years().map((y, yi) => {
									return (
										<button key={yi} onClick={() => selectYear(y)}>
											{y}
										</button>
									);
								})}
							</div>
							{/* .years */}
							<div className={style.months}>
								{months().map((m, mi) => {
									return (
										<button key={mi} onClick={() => selectMonth(mi)}>
											{m}
										</button>
									);
								})}
							</div>
							{/* .months */}
						</div>
					)}
				</div>
				<button
					onClick={() => changeMonth(monthAction.NEXT)}
					className={style.nextMonth}
					disabled={busy}
				>
					<Image
						src="/images/right-arrow-outline-green.svg"
						alt=""
						width={8}
						height={14}
					/>
				</button>
			</div>
			{/* .controls */}
			<div className={style.weeks}>
				{dates.map((w, wi) => {
					return (
						<div key={wi} className={style.week}>
							<ul>
								{w.map((d, di) => {
									return display.month - 1 === d.month ? (
										<li key={di}>
											<button
												onClick={() => selectNewDate(d)}
												className={`${
													moment(
														`${d.date}/${d.month + 1}/${d.year}`,
														"D/M/YYYY"
													).isSame(moment(selectedDate), "day")
														? style.selected
														: ""
												} ${hasData(d) ? style.hasData : ""}`}
												disabled={moment(
													`${d.date}/${d.month + 1}/${d.year}`,
													"D/M/YYYY"
												).isAfter(moment(), "day")}
											>
												{d.date}
											</button>
										</li>
									) : (
										<div key={di}></div>
									);
								})}
							</ul>
						</div>
					);
				})}
			</div>
			{/* .dates */}
		</div>
	);
};

export default Calendar;
