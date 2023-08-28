import Link from "next/link";
import Header from "../../components/guestHeader";
import style from "./apply.module.scss";
import { useState } from "react";
import { useRouter } from "next/router";

const Apply = () => {
  const [apply, setApply] = useState(false);
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
        <form name="apply" data-netlify="true">
          <input type="text" name="rec" hidden value={router.query.rec} />
          <input
            type="text"
            name="position"
            hidden
            value={router.query.position}
          />
          <div className={style.formHeader}>
            <h2>Apply for - {router.query.position}</h2>
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
  );
};

export default Apply;
