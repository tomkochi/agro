import style from "./header.module.scss";

const Header = ({ title }) => {
  return (
    <div className={style.header}>
      <div className={style.left}>
        <div className={style.logo}>
          <img src="/images/logo.svg" width={140} alt="" />
          <h2>{title}</h2>
        </div>
        {/* .currentPosition */}
      </div>
      {/* .left */}
      <div className={style.right}>
        <div className={style.loggedIn}>
          <button>Logout</button>
        </div>
      </div>
      {/* .right */}
    </div>
  );
};

export default Header;
