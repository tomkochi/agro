import style from "./header.module.scss";
import Link from "next/link";

const Header = ({ title, children }) => {
  return (
    <div className={style.header}>
      <div className={style.left}>
        <div className={style.logo}>
          <Link href="/dashboard" passHref>
            <img src="/images/logo.svg" width={140} alt="" />
          </Link>
          <h2>{title}</h2>
        </div>
        {/* .currentPosition */}
      </div>
      {/* .left */}
      <div className={style.right}>
        {children}
        <div className={style.loggedIn}>
          <button className={style.logout}>Logout</button>
        </div>
      </div>
      {/* .right */}
    </div>
  );
};

export default Header;
