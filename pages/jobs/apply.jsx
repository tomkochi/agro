import Link from "next/link";
import Header from "../../components/guestHeader";
import style from "./apply.module.scss";
import { useState } from "react";
import { useRouter } from "next/router";

const Apply = () => {
  const router = useRouter();

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
        <form
          name="resume"
          method="POST"
          enctype="multipart/form-data"
          data-netlify="true"
        >
          <input
            type="hidden"
            name="subject"
            value="Message from Agrofocal Website"
          />
          <input type="hidden" name="form-name" value="resume" />
          <div className={style.row}>
            <div className={style.inputGroup}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                required
              />
            </div>
            {/* .inputGroup */}
            <div className={style.inputGroup}>
              <label htmlFor="designation">Designation</label>
              <input
                type="text"
                name="designation"
                id="designation"
                placeholder="e.g. Manager"
                required
              />
            </div>
            {/* .inputGroup */}
          </div>
          {/* .row */}
          <div className={style.row}>
            <div className={style.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                name="email"
                id="email"
                placeholder="hello@mycompany.com"
                required
              />
            </div>
            {/* .inputGroup */}
            <div className={style.inputGroup}>
              <label htmlFor="organisation">Organisation</label>
              <input
                type="text"
                name="organisation"
                id="organisation"
                placeholder="Organisation"
                required
              />
            </div>
            {/* .inputGroup */}
          </div>
          {/* .row */}
          <div className={style.inputGroup}>
            <label htmlFor="message">Message</label>
            <textarea
              name="message"
              id="message"
              placeholder="How can we help?"
              required
            ></textarea>
          </div>
          {/* .inputGroup */}

          {/* <div className={style.inputGroup}>
            <label htmlFor="resume">Upload resume</label>
            <input
              type="file"
              name="resume"
              id="resume"
              accept=".pdf,.doc,.docx"
              required
            />
          </div> */}

          <div className={style.bottom}>
            <button type="submit">Submit</button>
          </div>
          {/* .bottom */}
        </form>
      </div>
    </div>
  );
};

export default Apply;
