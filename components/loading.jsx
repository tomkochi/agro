import style from "./loading.module.scss";

const Loading = ({ height }) => {
  return (
    <>
      <svg
        width="212"
        height={height}
        viewBox="0 0 212 62"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle className={style.one} cx="26" cy="26" r="26" fill="#6AAB72" />
        <circle className={style.two} cx="106" cy="26" r="26" fill="#6AAB72" />
        <circle
          className={style.three}
          cx="186"
          cy="26"
          r="26"
          fill="#6AAB72"
        />
      </svg>
    </>
  );
};

export default Loading;
