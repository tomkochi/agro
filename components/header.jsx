import style from "./header.module.scss";

const Header = () => {
  return (
    <div className={style.header}>
      <div className={style.left}>
        <div className={style.currentPosition}>
          <h2>Dashboard</h2>
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
