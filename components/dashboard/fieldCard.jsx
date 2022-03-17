import Image from "next/image";
import { useState } from "react";
import style from "./fieldCard.module.scss";
import { useRouter } from "next/router";

const FieldCard = ({ data }) => {
  const router = useRouter();

  const [showFullResult, setShowFullResult] = useState(false); // this decides show/hide more that 4

  const openGallery = (images) => {
    localStorage.setItem("gallery", JSON.stringify(images));
    router.push("/gallery");
  };

  return (
    <div className={style.fieldCard}>
      <button
        onClick={() => openGallery(data.result.images)}
        className={style.top}
      >
        <h4>{data.field}</h4>
        <h5>{data.area}</h5>
        <button>
          <Image
            src="/images/menu-three-dots.svg"
            alt=""
            width={4}
            height={20}
          />
        </button>
      </button>
      {/* .top */}
      <div className={style.middle}>
        {data.result.objects.name.map((r, ri) => {
          if (showFullResult) {
            // show more
            return (
              <div key={ri} className={style.item}>
                <h4>{r}</h4>
                <h5>{data.result.objects.value[ri]}</h5>
              </div>
            );
          } else {
            // show maximum 4
            if (ri < 4) {
              return (
                <div key={ri} className={style.item}>
                  <h4>{r}</h4>
                  <h5>{data.result.objects.value[ri]}</h5>
                </div>
              );
            }
          }
        })}
        {data.result.objects.name.length > 4 && ( // only if more than 4 items todisplay
          <div className={style.showMore}>
            <button onClick={() => setShowFullResult(!showFullResult)}>
              <span>+3</span> more items
            </button>
          </div>
        )}
      </div>
      {/* .middle */}
      <div className={style.bottom}>
        <h4>{data.result.objects.value.reduce((a, b) => a + b)}</h4>
      </div>
      {/* .bottom */}
    </div>
  );
};

export default FieldCard;
