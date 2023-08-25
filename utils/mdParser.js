// utils/mdParser.js
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const getJobsData = () => {
  const jobsDir = path.join(process.cwd(), "jobs");
  const fileNames = fs.readdirSync(jobsDir);

  const jobsData = fileNames.map((fileName) => {
    const filePath = path.join(jobsDir, fileName);
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContents);
    return {
      slug: fileName.replace(".md", ""),
      frontMatter: data,
      markdownContent: content,
    };
  });

  return jobsData;
};

module.exports = { getJobsData };
