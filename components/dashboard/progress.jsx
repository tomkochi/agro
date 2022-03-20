import style from "./progress.module.scss";

const Progress = ({ size, done }) => {
  // size - total size of the file
  // done - uploaded till now
  const calcPercent = () => {
    return `${(100 / size) * done}%`;
  };

  return (
    <div className={style.progress}>
      <h4>Upload in progress</h4>
      <h4>
        {size} - {done}
      </h4>
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
