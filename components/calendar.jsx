import style from "./calendar.module.scss";
import { datesGenerator, daysInMonth } from "dates-generator";
import { useEffect, useState } from "react";
import Image from "next/image";

const Calendar = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dates, setDates] = useState([]);

  const makeNewDate = (d) => {
    setSelectedDate(new Date(`${d.year}/${d.month + 1}/${d.date}`));
  };

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

  useEffect(() => {
    const body = {
      month: selectedDate.getMonth(),
      year: selectedDate.getFullYear(),
    };
    const { dates } = datesGenerator(body);

    setDates([...dates]);
  }, [selectedDate]);

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
          {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
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
                          makeNewDate({
                            date: d.date,
                            month: d.month,
                            year: d.year,
                          })
                        }
                        className={`${
                          d.date === selectedDate.getDate()
                            ? style.selected
                            : ""
                        } ${d.date === 10 ? style.hasData : ""}`}
                      >
                        {d.date}
                      </button>
                    </li>
                  ) : (
                    <div></div>
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
