import style from "./calendar.module.scss";
import { datesGenerator, daysInMonth } from "dates-generator";
import { useEffect, useState } from "react";
import Image from "next/image";
import moment from "moment";
import { useRouter } from "next/router";

const Calendar = ({ monthData = [], getMonthData, fetchDateData }) => {
  const router = useRouter();

  const monthAction = {
    TO: 0,
    NEXT: 1,
    PREVIOUS: 2,
  };
  Object.freeze(monthAction);

  const [selectedDate, setSelectedDate] = useState(
    router.query.d ? new Date(router.query.d * 1000) : new Date()
  );
  const [dates, setDates] = useState([]); // date array for the whole month

  const [display, setDisplay] = useState({
    year: parseInt(moment().format("YYYY")),
    month: parseInt(moment().format("M")),
  });

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
    setTimeout(() => {
      getMonthData(
        moment(`${year}/${month}/1 12:59:59`, "YYYY/M/D HH:mm:ss").unix()
      );
    }, 200);
  };

  const hasData = (d) => {
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
    setSelectedDate(date);
    const newDate = moment(date).format("YYYY/MM/DD");
    router.push(
      {
        pathname: "/dashboard",
        query: { d: moment(date).unix() },
      },
      undefined,
      { shallow: true }
    );
    fetchDateData(moment(date).unix(), monthData.includes(newDate));
  };

  const selectYear = (y) => {
    setDisplay((d) => {
      return {
        year: y,
        month: d.month,
      };
    });
    displayCalendar(y, display.month);
  };
  const selectMonth = (m) => {
    setDisplay((d) => {
      return {
        year: d.year,
        month: m + 1,
      };
    });
    displayCalendar(display.year, m + 1);
  };

  const handleOutsideClick = (e) => {
    console.log(e);
    setYearMonthSelector(false);
  };

  useEffect(() => {
    if (yearMonthSelector) {
      document.addEventListener("click", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [yearMonthSelector]);

  useEffect(() => {
    const year = parseInt(moment().format("YYYY"));
    const month = parseInt(moment().format("MM"));
    setDisplay({
      year,
      month,
    });
    displayCalendar(year, month);
  }, []);

  return (
    <div className={style.calendar}>
      <div className={style.controls}>
        <button
          onClick={() => changeMonth(monthAction.PREVIOUS)}
          className={style.previousMonth}
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
                        onClick={() =>
                          selectNewDate(
                            new Date(
                              `${d.year}/${d.month + 1}/${d.date} 12:59:59`
                            )
                          )
                        }
                        className={`${
                          d.date === selectedDate.getDate() &&
                          d.month === selectedDate.getMonth() &&
                          d.year === selectedDate.getFullYear()
                            ? style.selected
                            : ""
                        } ${hasData(d) ? style.hasData : ""}`}
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
