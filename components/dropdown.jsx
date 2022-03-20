import style from "./dropdown.module.scss";
import { useRef, useState, useEffect } from "react";

const Dropdown = ({ data = [], value, onSelection }) => {
  const wrapperRef = useRef(null);
  const [open, setOpen] = useState(false); // dropdown menu state

  const documentClick = (e) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      // clecked outside
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", documentClick);
    return () => {
      document.removeEventListener("click", documentClick);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={style.wrapper}>
      <button
        onClick={() => setOpen((c) => !c)}
        className={`${style.dropdown} ${open ? style.open : ""}`}
      >
        {value?.name}
      </button>
      <div className={`${style.menu} ${open ? style.open : ""}`}>
        {data.map((f) => {
          return (
            <button
              key={f._id}
              onClick={() => {
                onSelection(f);
                setOpen(false);
              }}
              className={style.menuItem}
            >
              {f.name}
            </button>
          );
        })}
      </div>
      {/* .menu */}
    </div>
  );
};

export default Dropdown;
