import style from "./index.module.scss";
import axios from "axios";
import moment from "moment";
import Router from "next/router";

import Layout from "../../components/layout";
import PageHeader from "../../components/header";

const Chart = ({ authKey, from, to, data }) => {
  console.log(data);
  return (
    <Layout
      title={`Chart - ${moment(from).format("DD MMM, YYYY")} to ${moment(
        to
      ).format("DD MMM, YYYY")}`}
      bg="#F3F3F3"
    >
      <PageHeader title={"Chart"}></PageHeader>
      <div className={style.chart}></div>
    </Layout>
  );
};

export default Chart;

export async function getServerSideProps(ctx) {
  const { authKey } = ctx.req.cookies;
  if (authKey) {
    let { f, t } = ctx.query;
    if (!f || !t) {
      f = moment().startOf("month").unix();
      t = moment().endOf("month").unix();
    }

    const r = await axios({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/data/list/range`,
      method: "post",
      headers: {
        content_type: "application/json",
        authKey: ctx.req.cookies.authKey,
      },
      data: {
        fromdate: parseInt(f),
        todate: parseInt(t),
        field: [],
      },
    });
    return {
      props: {
        authKey: ctx.req.cookies.authKey || null,
        from: f * 1000,
        to: t * 1000,
        data: r.data.data,
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/?a=chart",
      },
      props: {},
    };
  }
}
