import style from "./index.module.scss";
import axios from "axios";
import moment from "moment";
import Dropdown from "../../components/dropdown";

import Layout from "../../components/layout";
import PageHeader from "../../components/header";
import Calendar from "../../components/calendar";
import { useState, useEffect } from "react";
import { userStore } from "../../store";
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
  const user = userStore((state) => state.user);
  const allFields = { _id: 0, name: "All" };
  const [fields, setFields] = useState([]);
  const [selectedFieldFilter, setSelectedFieldFilter] = useState(allFields);
  const [bardata, setBardata] = useState([]);
  const [forecast, setForecast] = useState([]);

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
        setBardata(r.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [selectedPeriod]);

  useEffect(() => {
    if (selectedPeriod == "day") {
      axios({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/data/forecast`,
        method: "post",
        headers: {
          content_type: "application/json",
          authKey: "agroQ1dr$sA",
        },
        data: { date: date / 1000, field: [] },
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
  }, [selectedPeriod]);

  return (
    <Layout
      title={`Chart - ${moment(date / 1000).format("DD MM, YYYY")}`}
      bg="#F3F3F3">
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
        <div className={style.chartCard}>
          <BarChart width={680} height={400} data={bardata}>
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
            <Bar dataKey="total" fill={BarColors.total} />
          </BarChart>
        </div>
        {selectedPeriod == "day" ? (
          <div className={style.chartCard}>
            <LineChart width={800} height={400} data={dataConvert(forecast)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Line
                type="monotone"
                dataKey="value"
                stroke={BarColors.ripe}
                activeDot={{ r: 10 }}
                strokeWidth={3}
              />
            </LineChart>
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

export const dataConvert = (data) => {
  return data.map((d, i) => {
    let date = moment().add(i, "days").format("DD MMM");
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
