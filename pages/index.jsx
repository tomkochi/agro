import style from "./index.module.scss";
import Calendar from "../components/calendar";
import Layout from "../components/layout";
import Image from "next/image";
import FieldCard from "../components/dashboard/fieldCard";

const Dashboard = () => {
  return (
    <Layout title="Dashboard" bg="#F3F3F3">
      <div className={style.dashboard}>
        <header>
          <div className={style.status}></div>
          <button className={style.inspectVideo}>Inspect video</button>
        </header>
        <main>
          <div className={style.calendar}>
            <Calendar />
          </div>
          {/* .calendar */}
          <div className={style.reports}>
            <div className={style.header}>
              <div className={style.headerLeft}>
                <h4>3</h4>
                <h5>Reports found</h5>
              </div>
              {/* .left */}
              <div className={style.headerRight}>
                <button className={style.showChart}>
                  <Image
                    src="/images/chart-icon.svg"
                    alt=""
                    width={18}
                    height={10}
                  />
                  <h5>15 April 2021</h5>
                </button>
              </div>
              {/* .right */}
            </div>
            {/* .header */}
            <div className={style.cards}>
              <FieldCard />
              <FieldCard />
              <FieldCard />
            </div>
            {/* .body */}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Dashboard;
