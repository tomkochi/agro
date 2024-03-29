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
          <input type="text" name="rec" hidden value={router.query.rec} />
          <input
            type="text"
            name="position"
            hidden
            value={router.query.position}
          />
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
              <label htmlFor="document">Upload resume</label>
              <input type="file" name="document" id="document" required />
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
