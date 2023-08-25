import fs from "fs";
import path from "path";
import yaml from "js-yaml";

const JobPage = ({ rec, date, position, type, location, content }) => {
  return (
    <div>
      <p>{rec}</p>
      <p>{date}</p>
      <p>{position}</p>
      <p>{type}</p>
      <p>{location}</p>
      <p>{content}</p>
    </div>
  );
};

export async function getServerSideProps() {
  const jobDirectory = path.join(process.cwd(), "jobs");
  const yamlString = fs.readFileSync(
    `${jobDirectory}/2023-fae-06.yaml`,
    "utf8"
  );
  const data = yaml.load(yamlString);

  const { rec, date, position, type, location, content } = data;

  return {
    props: {
      rec,
      date,
      position,
      type,
      location,
      content,
    },
  };
}

export default JobPage;
