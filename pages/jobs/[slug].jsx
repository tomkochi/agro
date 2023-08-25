import Link from "next/link";
import Header from "../../components/guestHeader";
import { getJobsData } from "../../utils/mdParser";
import style from "./[slug].module.scss";
import ReactMarkdown from "react-markdown";

const JobPage = ({ jobData }) => {
  console.log({ jobData });
  return (
    <div className={style.jobPage}>
      <Header>
        <Link href="/" passHref>
          <a>
            <img src="/images/logo.svg" alt="" />
          </a>
        </Link>
      </Header>
      <div className={style.jobDetails}>
        <div className={style.topLine}>
          <h5>{jobData.frontMatter.rec}</h5>
          <h6>|</h6>
          <h5>{jobData.frontMatter.date}</h5>
        </div>
        <h1>{jobData.frontMatter.position}</h1>
        <div className={style.bottomLine}>
          <h5>{jobData.frontMatter.type}</h5>
          <h6>|</h6>
          <h5>{jobData.frontMatter.location}</h5>
        </div>
        <div className={style.html}>
          <ReactMarkdown>{jobData.markdownContent}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
  <Header>
    <Link href="/" passHref>
      <a>
        <img src="/images/logo.svg" alt="" />
      </a>
    </Link>
  </Header>;
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
