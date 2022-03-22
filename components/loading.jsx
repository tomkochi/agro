import style from "./loading.module.scss";

const Loading = ({ height }) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="164"
        height="164"
        viewBox="0 0 164 164"
      >
        <g fill="none" fill-rule="evenodd">
          <circle className={style.one} cx="36" cy="79" r="15" fill="#69AA72" />
          <circle
            className={style.three}
            cx="129"
            cy="79"
            r="15"
            fill="#69AA72"
          />
          <circle className={style.two} cx="82" cy="79" r="15" fill="#69AA72" />
        </g>
      </svg>
    </>
  );
};

export default Loading;
