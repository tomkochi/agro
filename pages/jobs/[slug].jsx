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
            <button onClick={() => setApply(true)}>Apply</button>
          </div>
        </div>
        <div className={style.html}>
          <ReactMarkdown>{jobData.markdownContent}</ReactMarkdown>
        </div>
      </div>
      {apply && (
        <div className={style.applyOverlay}>
          <div className={style.applyContainer}>
            <form name="apply" netlify>
              <input
                type="text"
                name="rec"
                hidden
                value={jobData.frontMatter.rec}
              />
              <input
                type="text"
                name="date"
                hidden
                value={jobData.frontMatter.date}
              />
              <input
                type="text"
                name="position"
                hidden
                value={jobData.frontMatter.position}
              />
              <div className={style.formHeader}>
                <h2>Apply for - {jobData.frontMatter.position}</h2>
                <button
                  type="button"
                  className={style.close}
                  onClick={() => setApply(false)}
                >
                  <svg
                    width="14"
                    height="15"
                    viewBox="0 0 14 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 1L1 13.6076"
                      stroke="#343A40"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M1 1L13 13.6076"
                      stroke="#343A40"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div className={style.row}>
                <div className={style.inputGroup}>
                  <label htmlFor="firstname">First name</label>
                  <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    placeholder="First name"
                    required
                  />
                </div>
                <div className={style.inputGroup}>
                  <label htmlFor="lastname">Last name</label>
                  <input
                    type="text"
                    name="lastname"
                    id="lastname"
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>
              <div className={style.rowFull}>
                <div className={style.inputGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="hello@myid.com"
                    required
                  />
                </div>
              </div>
              <div className={style.rowFull}>
                <div className={style.inputGroup}>
                  <label htmlFor="resume">Upload resume</label>
                  <input
                    type="file"
                    name="resume"
                    id="resume"
                    accept=".pdf,.doc,.docx"
                    required
                  />
                </div>
              </div>
              <button type="submit" className={style.submit}>
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
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
