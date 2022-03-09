import Image from "next/image";
import style from "./fieldCard.module.scss";

const FieldCard = () => {
  return (
    <div className={style.fieldCard}>
      <div className={style.top}>
        <h4>Field Name</h4>
        <h5>10 Acres</h5>
        <button>
          <Image
            src="/images/menu-three-dots.svg"
            alt=""
            width={4}
            height={20}
          />
        </button>
      </div>
      {/* .top */}
      <div className={style.middle}>
        <div className={style.item}>
          <h4>Flower</h4>
          <h5>100</h5>
        </div>
        {/* .item */}
        <div className={style.item}>
          <h4>Damage</h4>
          <h5>150</h5>
        </div>
        {/* .item */}
      </div>
      {/* .middle */}
      <div className={style.bottom}>
        <h4>250</h4>
      </div>
      {/* .bottom */}
    </div>
  );
};

export default FieldCard;
