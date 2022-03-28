import style from "./calendar.module.scss";
import { datesGenerator, daysInMonth } from "dates-generator";
import { useEffect, useState } from "react";
import Image from "next/image";
import moment from "moment";

const Calendar = ({ monthData = [], getMonthData, fetchDateData }) => {
  const monthAction = {
    TO: 0,
    NEXT: 1,
    PREVIOUS: 2,
  };
  Object.freeze(monthAction);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dates, setDates] = useState([]); // date array for the whole month

  const [display, setDisplay] = useState({
    year: parseInt(moment().format("YYYY")),
    month: parseInt(moment().format("M")),
  });

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
    fetchDateData(moment(date).unix(), monthData.includes(newDate));
  };

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
        <button className={style.monthAndYear}>
          {moment(display.month, "M").format("MMMM")} {display.year}
        </button>
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
