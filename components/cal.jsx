import style from "./calendar.module.scss";
import { datesGenerator, daysInMonth } from "dates-generator";
import { useEffect, useState } from "react";
import Image from "next/image";
import moment from "moment";

const Calendar = ({ monthData = [], fetchDateData }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dates, setDates] = useState([]); // date array for the whole month

  const nextMonth = () => {
    const curDate = selectedDate.getDate();
    const curMonth = selectedDate.getMonth();
    const curYear = selectedDate.getFullYear();

    let newMonth = curMonth + 1;

    let newYear = curYear;
    let newDate = curDate;

    if (newMonth >= 12) {
      newMonth = 1;
      newYear++;
    } else {
      newMonth++;
    }
    if (selectedDate.getDate() > daysInMonth(newYear, newMonth - 1)) {
      newDate = daysInMonth(newYear, newMonth - 1);
    }
    setSelectedDate(new Date(`${newYear}/${newMonth}/${newDate}`));
  };
  const previousMonth = () => {
    const curDate = selectedDate.getDate();
    const curMonth = selectedDate.getMonth();
    const curYear = selectedDate.getFullYear();

    let newMonth = curMonth;

    let newYear = curYear;
    let newDate = curDate;

    if (newMonth <= 0) {
      newMonth = 12;
      newYear--;
    }

    setSelectedDate(new Date(`${newYear}/${newMonth}/${newDate}`));
  };

  const hasData = (d) => {
    const date = moment({ year: d.year, month: d.month, day: d.date }).format(
      "YYYY/MM/DD"
    );
    return monthData.includes(date);
  };

  useEffect(() => {
    const body = {
      month: selectedDate.getMonth(),
      year: selectedDate.getFullYear(),
    };
    const { dates } = datesGenerator(body);

    setDates([...dates]);

    // check if the selected date has data
    const date = selectedDate.getDate();
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();

    let newM = month < 9 ? `0${month + 1}` : month + 1;

    const newDate = `${year}/${newM}/${date}`;
    fetchDateData(
      new Date(`${newDate} 23:59:59`).getTime(),
      monthData.includes(newDate)
    );
  }, [selectedDate]);

  useEffect(() => {
    if (!monthData) return;
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const newM = month < 9 ? "0" + (month + 1) : month;
    const date = today.getDate();
    const newDate = `${year}/${newM}/${date}`;
    if (monthData.includes(newDate)) {
      fetchDateData(new Date(`${newDate} 23:59:59`).getTime());
    }
  }, [monthData]);

  return (
    <div className={style.calendar}>
      <div className={style.controls}>
        <button onClick={() => previousMonth()} className={style.previousMonth}>
          <Image
            src="/images/left-arrow-outline-green.svg"
            alt=""
            width={8}
            height={14}
          />
        </button>
        <button className={style.monthAndYear}>
          {moment(selectedDate).format("MMMM")}{" "}
          {moment(selectedDate).format("YYYY")}
        </button>
        <button onClick={() => nextMonth()} className={style.nextMonth}>
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
                  return selectedDate.getMonth() === d.month ? (
                    <li key={di}>
                      <button
                        onClick={() =>
                          setSelectedDate(
                            new Date(`${d.year}/${d.month + 1}/${d.date}`)
                          )
                        }
                        className={`${
                          d.date === selectedDate.getDate()
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
