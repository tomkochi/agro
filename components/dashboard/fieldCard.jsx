import Image from "next/image";
import { useState } from "react";
import style from "./fieldCard.module.scss";
import { useRouter } from "next/router";
import moment from "moment";

const FieldCard = ({ data }) => {
  const router = useRouter();

  const [showFullResult, setShowFullResult] = useState(false); // this decides show/hide more that 4

  const openGallery = () => {
    // currently there's no api to fetch gallery date for a particular result
    // need to chenge once we get the api
    localStorage.setItem("gallery", JSON.stringify(data.result.images));
    localStorage.setItem("field", data.field);
    router.push("/gallery");
  };

  return (
    <div className={style.fieldCard}>
      <button onClick={openGallery} className={style.top}>
        <h4>{data.field}</h4>
        <h5>
          {data.area} acres
          <span>{moment.unix(data.date).local().format("hh:mm a")}</span>
        </h5>
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
                <h5>
                  {data.result.objects.value[ri]} <span>%</span>
                </h5>
              </div>
            );
          } else {
            // show maximum 4
            if (ri < 4) {
              return (
                <div key={ri} className={style.item}>
                  <h4>{r}</h4>
                  <h5>
                    {data.result.objects.value[ri]}{" "}
                    <span>{data.result.objects.unit[ri]}</span>
                  </h5>
                </div>
              );
            }
          }
        })}
        {data.result.objects.name.length > 4 && ( // only if more than 4 items todisplay
          <div className={style.showMore}>
            <button
              onClick={() => setShowFullResult(!showFullResult)}
              className={showFullResult ? "" : style.expanded}
            >
              {showFullResult ? (
                "Show less"
              ) : (
                <>
                  <span>+{data.result.objects.name.length - 4}</span> more items
                </>
              )}
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
