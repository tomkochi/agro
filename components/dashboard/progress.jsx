import style from "./progress.module.scss";

const Progress = (size, done) => {
  const calcPercent = () => {
    return `${(100 / size) * done}%`;
  };

  return (
    <div className={style.progress}>
      <h4>Upload in press</h4>
      <div className={style.barWrapper}>
        <div className={style.bg}></div>
        <div
          className={style.fg}
          style={{
            width: calcPercent(),
          }}
        ></div>
      </div>
      {/* .barWrapper */}
    </div>
  );
};

export default Progress;
