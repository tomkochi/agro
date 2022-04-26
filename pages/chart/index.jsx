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
  const router = useRouter();

  const user = userStore((state) => state.user); // user from store
  const allFields = { _id: 0, name: "All" }; // for default selection
  const [fields, setFields] = useState([]); // this will be populated in useEffect[user]
  const [selectedFieldFilter, setSelectedFieldFilter] = useState(allFields); // defaultly set to all fields
  const [bardata, setBardata] = useState([]); // data for charts
  const [forecast, setForecast] = useState([]); // data for charts

  const [selectedPeriod, setSelectedPeriod] = useState("day"); // 'day', 'month' or 'year'
  const [selectedDate, setSelectedDate] = useState(date / 1000); // epoch

  const [monthData, setMonthData] = useState([]); // which all dates of this month has data
  const [dateData, setDateData] = useState([]); // selected day's data

  const [windowWidth, setwindowWidth] = useState(0); // for calculating chart size

  const [calendar, setCalendar] = useState(false); // whether to show calendar or not
  const calendarWrapper = useRef(null); // mainly for outside click tracking

  // Fetching the data for a particular date
  const fetchDateData = (date, hasData) => {
    // if this date has no data clear dateData and return
    if (!hasData) {
      setDateData([]);
      return;
    }

    setBusy(true); // show loading component

    axios({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/data/list`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        authKey,
      },
      data: {
        date,
        field: selectedFieldFilter._id === 0 ? [] : [selectedFieldFilter._id], // if all is selected pass no value.
      },
    })
      .then((r) => {
        setDateData(r.data.data); // set the result
      })
      .catch((e) => {
        // console.log(e);
      })
      .finally(() => {
        setBusy(false); // hide loading component
      });
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
        date: selectedDate,
        field,
        type: selectedPeriod,
        counttype: "acre",
      },
    })
      .then((r) => {
        setBardata(r.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [selectedPeriod, selectedFieldFilter, selectedDate]);

  // [selectedPeriod, selectedFieldFilter, selectedDate]
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
          setForecast(r.data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [selectedPeriod, selectedFieldFilter, selectedDate]);

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

    getMonthData(moment(selectedDate).utc().unix() * 1000); // get months data

    window.addEventListener("resize", windowResized); // track window resize
    return () => {
      window.removeEventListener("resize", windowResized);
    };
  }, []);

  return (
    <Layout
      title={`Chart - ${moment(selectedDate).format("DD MM, YYYY")}`}
      bg="#F3F3F3">
      <PageHeader title={"Chart"} authKey={authKey}></PageHeader>
      <div className={style.chart}>
        <div className={style.dataControls}>
          <div className={style.dropdownWrapper}>
            <Dropdown
              data={[allFields, ...fields]}
              value={selectedFieldFilter}
              onSelection={fieldChange}
              label="Fields"
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
                onClick={() => setSelectedPeriod("day")}>
                Day
              </button>
              <button
                className={selectedPeriod === "week" ? style.active : ""}
                onClick={() => setSelectedPeriod("week")}>
                Week
              </button>
              <button
                className={selectedPeriod === "month" ? style.active : ""}
                onClick={() => setSelectedPeriod("month")}>
                Month
              </button>
              <button
                className={selectedPeriod === "year" ? style.active : ""}
                onClick={() => setSelectedPeriod("year")}>
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
        <div className={style.cardWrapper}>
          <h4>Count/Acre</h4>
          <div className={style.chartCard}>
            <BarChart data={bardata} width={windowWidth / 2 - 160} height={400}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={(d) => moment.unix(d.date).format("DD MMM")} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ripe" fill={BarColors.ripe} />
              <Bar dataKey="full" fill={BarColors.full} />
              <Bar dataKey="mid" fill={BarColors.mid} />
              <Bar dataKey="small" fill={BarColors.small} />
              <Bar dataKey="flower" fill={BarColors.flower} />
            </BarChart>
          </div>
        </div>
        {selectedPeriod == "day" ? (
          <div className={style.cardWrapper}>
            <h4>Forecast for ripe</h4>
            <div className={style.chartCard}>
              <LineChart
                data={dataConvert(forecast, selectedDate)}
                width={windowWidth / 2 - 160}
                height={400}>
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
            </div>
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

    return {
      props: {
        authKey: authKey || null,
        date:
          d === undefined ? moment().startOf("day").unix() * 1000 : d * 1000,
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
