import Link from "next/link";
import Header from "../../components/guestHeader";
import style from "./apply.module.scss";
import { useState } from "react";
import { useRouter } from "next/router";

const Apply = () => {
  const router = useRouter();
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("rec", router.query.rec);
    formData.append("position", router.query.position);
    formData.append("firstname", document.getElementById("firstname").value);
    formData.append("lastname", document.getElementById("lastname").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("file", file);

    try {
      const response = await fetch("/netlify/functions/upload.js", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("File uploaded successfully");
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  return (
    <div className={style.jobPage}>
      <Header>
        <Link href="/" passHref>
          <a>
            <img src="/images/logo.svg" alt="logo" />
          </a>
        </Link>
      </Header>
      <div className={style.apply}>
        <form onSubmit={handleSubmit}>
          {/* <input
            type="hidden"
            name="subject"
            value="Message from Agrofocal Website"
          />
          <input type="hidden" name="form-name" value="apply" /> */}
          <div className={style.formHeader}>
            <h2>Apply for - {router.query.position}</h2>
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
                enctype="multipart/form-data"
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
  );
};

export default Apply;
