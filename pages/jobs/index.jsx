import fs from "fs";
import path from "path";
import yaml from "js-yaml";

import style from "./jobPage.module.scss";
import Link from "next/link";

const JobPage = ({ jobListings }) => {
  function removeFileExtension(filename) {
    return filename.replace(/\.[^/.]+$/, "");
  }
  return (
    <div className={style.jobPage}>
      <h1>Job listing</h1>
      =================================
      {jobListings.map((job) => {
        return (
          <div className={style.job}>
            <Link href={`jobs/${removeFileExtension(job.fileName)}`}>
              <a>
                <h2>{job.fileName}</h2>
                <h2>{job.position}</h2>
                <h2>{job.rec}</h2>
                <h2>{job.date}</h2>
                <h2>{job.type}</h2>
                <h2>{job.location}</h2>
              </a>
            </Link>
            <hr></hr>
          </div>
        );
      })}
    </div>
  );
};

const getJobListings = () => {
  const jobDirectory = path.join(process.cwd(), "jobs");
  const fileNames = fs.readdirSync(jobDirectory);

  const yamlFileNames = fileNames.filter(
    (fileName) => path.extname(fileName).toLowerCase() === ".yaml"
  );

  const jobListings = yamlFileNames.map((fileName) => {
    const filePath = path.join(jobDirectory, fileName);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const jobListing = yaml.load(fileContent);
    jobListing.fileName = fileName;
    return jobListing;
  });

  return jobListings;
};

export async function getServerSideProps() {
  const jobListings = getJobListings();
  return {
    props: {
      jobListings,
    },
  };
}

export default JobPage;
