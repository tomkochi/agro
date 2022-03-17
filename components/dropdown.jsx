import style from "./dropdown.module.scss";
import { useRef, useState } from "react";

const Dropdown = (data) => {
  const wrapperRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(data[0]);
  return (
    <div ref={wrapperRef} className={style.wrapper}>
      <button
        onClick={() => setFieldFilterOpen((c) => !c)}
        className={`${style.dropdown} ${open ? style.open : ""}`}
      >
        {selected?.name}
      </button>
      <div className={`${style.menu} ${open ? style.open : ""}`}>
        {data.map((f) => {
          return (
            <button
              key={f._id}
              onClick={() => setFieldFilter(f)}
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
