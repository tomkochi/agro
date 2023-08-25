import Link from "next/link";
import { getJobsData } from "../../utils/mdParser";
import Header from "../../components/guestHeader";

import style from "./style.module.scss";

const JobsPage = ({ jobsData }) => {
  return (
    <div className={style.jobs}>
      <Header>
        <Link href="/" passHref>
          <a>
            <img src="/images/logo.svg" alt="" />
          </a>
        </Link>
      </Header>
      <div className={style.cards}>
        {jobsData.map((job) => (
          <Link href={`/jobs/${job.slug}`} key={job.slug}>
            <a className={style.card}>
              <div className={style.topPart}>
                <h3>{job.frontMatter.position}</h3>
                <p>{job.frontMatter.excerpt}</p>
              </div>
              <div className={style.bottomLine}>
                <h2>{job.frontMatter.type}</h2>
                <h2>{job.frontMatter.date}</h2>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const jobsData = getJobsData();
  return {
    props: {
      jobsData,
    },
  };
}

export default JobsPage;
