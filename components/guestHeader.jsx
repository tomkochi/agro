import style from "./guestHeader.module.scss";
import Link from "next/link";

const GuestHeader = ({ children }) => {
  return (
    <div className={style.guestHeader}>
      <div className={style.left}>{children}</div>
      {/* .left */}
      <div className={style.right}>
        <Link href="/jobs">
          <a className={style.jobs}>Jobs</a>
        </Link>
        <a
          href="http://app.agrofocal.ai"
          className={style.login}
          style={{ display: "none" }}
        >
          Login
        </a>
      </div>
      {/* .right */}
    </div>
  );
};

export default GuestHeader;
