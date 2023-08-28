import Link from "next/link";
import Header from "../../components/guestHeader";
import { getJobsData } from "../../utils/mdParser";
import style from "./[slug].module.scss";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

const JobPage = ({ jobData }) => {
  const [apply, setApply] = useState(false);
  return (
    <div className={style.jobPage}>
      <Header>
        <Link href="/" passHref>
          <a>
            <img src="/images/logo.svg" alt="logo" />
          </a>
        </Link>
      </Header>
      <div className={style.jobDetails}>
        <div className={style.topLine}>
          <h5>{jobData.frontMatter.rec}</h5>
          <h6>|</h6>
          <h5>{jobData.frontMatter.date}</h5>
        </div>
        <div className={style.jobHeading}>
          <div className={style.headingLeft}>
            <h1>{jobData.frontMatter.position}</h1>
            <div className={style.bottomLine}>
              <h5>{jobData.frontMatter.type}</h5>
              <h6>|</h6>
              <h5>{jobData.frontMatter.location}</h5>
            </div>
          </div>
          <div className={style.headingRight}>
            <Link
              href={{
                pathname: "/jobs/apply",
                query: {
                  rec: jobData.frontMatter.rec,
                  position: jobData.frontMatter.position,
                },
              }}
            >
              <a>Apply</a>
            </Link>
          </div>
        </div>
        <div className={style.html}>
          <ReactMarkdown>{jobData.markdownContent}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  const jobsData = getJobsData();
  const paths = jobsData.map((job) => ({
    params: { slug: job.slug },
  }));
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const jobsData = getJobsData();
  const jobData = jobsData.find((job) => job.slug === params.slug);
  return {
    props: {
      jobData,
    },
  };
}

export default JobPage;
