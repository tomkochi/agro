import style from "./gallery.module.scss";
import Layout from "../components/layout";
import { useState, useEffect } from "react";

const Gallery = () => {
  const [user, setUser] = useState(null);
  const [authKey, setAuthKey] = useState(null);
  const [images, setimages] = useState([]);
  const [popupImage, setPopupImage] = useState(null);

  const nextImage = () => {
    const newIndex =
      popupImage === images.length - 1 ? images.length - 1 : popupImage + 1;
    setPopupImage(newIndex);
  };
  const previousImage = () => {
    const newIndex = popupImage === 0 ? 0 : popupImage - 1;
    setPopupImage(newIndex);
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    if (!userInfo) {
      router.push("/");
      return false;
    }
    setUser(userInfo);
    const key = JSON.parse(localStorage.getItem("authKey"));
    setAuthKey(key);
    const passedImages = JSON.parse(localStorage.getItem("gallery"));
    setimages(passedImages);
  }, []);

  return (
    <Layout title="Gallery" bg="#F3F3F3">
      <div className={style.gallery}>
        <div className={style.views}>
          <button className={style.active}>Gallery</button>
          <button>Map view</button>
          <button>Graph</button>
        </div>
        {/* .views */}
        <h4>17 Mar 2022</h4>
        <div className={style.images}>
          {images.map((i, ii) => {
            return (
              <a
                href=""
                onClick={(e) => {
                  setPopupImage(ii);
                  e.preventDefault();
                }}
                key={ii}
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${i.link}?authKey=${authKey}`}
                  alt=""
                />
              </a>
            );
          })}
        </div>
        {/* .images */}
        {popupImage !== null && (
          <div className={style.popup}>
            <button
              onClick={() => setPopupImage(null)}
              className={style.closeButton}
            >
              <img src="/images/close.svg" alt="" />
            </button>
            <button onClick={previousImage} className={style.navLeft}>
              <svg
                width="8"
                height="14"
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 1L1 7L7 13"
                  stroke="url(#paint0_linear_1276_263)"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_1276_263"
                    x1="8.54054"
                    y1="5.32"
                    x2="-0.918024"
                    y2="5.97776"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#69AA72" />
                    <stop offset="1" stop-color="#69AA72" />
                  </linearGradient>
                </defs>
              </svg>
            </button>
            {/* .navLeft */}
            <div className={style.image}>
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_URL}${images[popupImage].link}?authKey=${authKey}`}
                alt=""
              />
            </div>
            <button onClick={nextImage} className={style.navRight}>
              <svg
                width="8"
                height="14"
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 13L7 7L0.999999 1"
                  stroke="url(#paint0_linear_1276_262)"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_1276_262"
                    x1="-0.540541"
                    y1="8.68"
                    x2="8.91802"
                    y2="8.02224"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#69AA72" />
                    <stop offset="1" stop-color="#69AA72" />
                  </linearGradient>
                </defs>
              </svg>
            </button>
            {/* .navRight */}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Gallery;
