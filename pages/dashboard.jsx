import axios from "axios";
import style from "./dashboard.module.scss";
import Calendar from "../components/calendar";
import Layout from "../components/layout";
import Image from "next/image";
import FieldCard from "../components/dashboard/fieldCard";
import Progress from "../components/dashboard/progress";
import PageHeader from "../components/header";
import moment from "moment";
import Dropdown from "../components/dropdown";
import { useRef, useState, useEffect } from "react";
import Loading from "../components/loading";
import Link from "next/link";

const Dashboard = ({ authKey }) => {
  const inspectionStatus = {
    HIDDEN: 0,
    PROGRESS: 1,
    COMPLETED: 2,
  };
  Object.freeze(inspectionStatus);

  const [busy, setBusy] = useState(false);

  const [inspectionProgress, setInspectionProgress] = useState(
    inspectionStatus.HIDDEN
  );

  const [inspectionId, setInspectionId] = useState("");

  const [monthData, setMonthData] = useState([]); // which all dates of this month has data
  const [dateData, setDateData] = useState([]); // selected day's data

  const [user, setUser] = useState(null); // got while logging in

  const [file, setFile] = useState(null); // selected file stored in here
  const [uploadOverlay, setUploadOverlay] = useState(false); // whether to show upload overlay box after choosing the file

  const [selectedField, setSelectedField] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [selectedFieldFilter, setSelectedFieldFilter] = useState(null);

  const [fields, setFields] = useState([]); // got while logging in
  const [crops, setCrops] = useState([]); // got while logging in

  const [uploading, setUploading] = useState(false); // decides whether to show upload status indicator
  const [upSize, setUpSize] = useState(0); // uploaded size - from upload progress
  const [totalSize, setTotalSize] = useState(0); // size of the file from upload progress

  const fileInput = useRef(null);
  const fieldWrapper = useRef(null);
  const cropWrapper = useRef(null);
  const uploadWindow = useRef(null);

  const [selectedDate, setSelectedDate] = useState(new Date().getTime());

  const closeUploadOverlay = () => {
    setUploadOverlay(false);
  };

  const handleFile = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setUploadOverlay(true);
    } else {
      setUploadOverlay(false);
    }
  };
  const openFileDialog = () => {
    fileInput.current.click();
  };

  const documentClick = (e) => {
    if (fieldWrapper.current && !fieldWrapper.current.contains(e.target)) {
      setFieldOpen(false);
    }
    if (cropWrapper.current && !cropWrapper.current.contains(e.target)) {
      setCropOpen(false);
    }
  };

  const handleOverlay = (e) => {
    if (!uploadWindow.current.contains(e.target)) {
      setUploadOverlay(false);
    }
  };

  const humanFileSize = (bytes, dp = 1) => {
    const thresh = 1024;
    if (Math.abs(bytes) < thresh) {
      return bytes + " B";
    }
    const units = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let u = -1;
    const r = 10 ** dp;
    do {
      bytes /= thresh;
      ++u;
    } while (
      Math.round(Math.abs(bytes) * r) / r >= thresh &&
      u < units.length - 1
    );
    return bytes.toFixed(dp) + " " + units[u];
  };

  const upload = (e) => {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("cropid", selectedCrop._id);
    formData.append("cropname", selectedCrop.name);
    formData.append("fieldid", selectedField._id);
    axios({
      method: "post",
      url: `${process.env.NEXT_PUBLIC_UPLOAD_URL}/inspection/upload`,
      data: formData,
      onUploadProgress: (e) => {
        setUpSize(e.loaded);
        setTotalSize(e.total);
      },
      headers: {
        content_type: "multipart/form-data",
        authKey,
      },
    })
      .then((ur) => {
        if (ur.data.msg.code === 2007) {
          setInspectionProgress(inspectionStatus.PROGRESS);
          setInspectionId(ur.data.data.inspectionid);
          // check after some time
          const inspectionCheck = setInterval(() => {
            axios({
              method: "post",
              url: `${process.env.NEXT_PUBLIC_BASE_URL}/data/inspection`,
              data: { inspectionid: ur.data.data.inspectionid },
              headers: {
                content_type: "application/json",
                authKey,
              },
            })
              .then((ir) => {
                if (ir.data.data.status === "Analysis Completed") {
                  setInspectionProgress(inspectionStatus.COMPLETED);
                  // update monthsData
                  getMonthData(new Date().getTime());
                  // if selectedDate is today, refresh fieldcards
                  if (moment(selectedDate).isSame(moment(), "day")) {
                    fetchDateData(moment(selectedDate).unix(), true);
                  }
                  // clear interval
                  clearInterval(inspectionCheck);
                }
              })
              .catch((e) => {
                console.log(e);
              });
          }, 1000 * 10);
        } else {
          alert(ur.data.msg.msg);
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setUploading(false);
      });
    setUploadOverlay(false);
    setUploading(true);
  };

  const fetchDateData = (date, hasData) => {
    setSelectedDate(moment(date * 1000));
    if (!hasData) {
      setDateData([]);
      return;
    }

    setBusy(true);

    axios({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/data/list`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        authKey,
      },
      data: {
        date,
        field: [],
      },
    })
      .then((r) => {
        console.log(r);
        setDateData(r.data.data);
      })
      .catch((e) => {
        // console.log(e);
      })
      .finally(() => {
        setBusy(false);
      });
  };

  const getMonthData = (date) => {
    console.log("Getting monthData");
    axios({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/data/month/list`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        authKey,
      },
      data: {
        date: date,
      },
    })
      .then((r) => {
        setMonthData(r.data.data);
      })
      .catch((e) => alert(e));
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    setUser(userInfo);

    setFields(userInfo.account.fields);
    setCrops(userInfo.account.croptype);
    setSelectedField(userInfo.account.fields[0]);
    setSelectedCrop(userInfo.account.croptype[0]);
    setSelectedFieldFilter(userInfo.account.fields[0]);

    getMonthData(new Date().getTime());

    document.addEventListener("click", documentClick);
    return () => {
      document.removeEventListener("click", documentClick);
    };
  }, []);

  useEffect(() => {
    if (!uploadOverlay) {
      fileInput.current.value = "";
    }
  }, [uploadOverlay]);

  return (
    <Layout title="Dashboard" bg="#F3F3F3">
      <PageHeader title="Dashboard" authKey={authKey}>
        <button
          onClick={openFileDialog}
          className={style.selectVideoButton}
          disabled={uploading}
        >
          Select video
        </button>
      </PageHeader>
      <div className={style.dashboard}>
        <header>
          <div className={style.status}>
            {uploading && <Progress size={totalSize} done={upSize} />}
          </div>
          <input ref={fileInput} type="file" hidden onChange={handleFile} />
        </header>
        <main>
          <div className={style.leftPanel}>
            <div className={style.fieldFilter}>
              <Dropdown
                data={fields}
                value={selectedFieldFilter}
                onSelection={setSelectedFieldFilter}
              />
            </div>
            {/* .inputGroup */}
            <Calendar
              monthData={monthData}
              getMonthData={getMonthData}
              fetchDateData={fetchDateData}
            />
            {inspectionProgress !== inspectionStatus.HIDDEN && (
              <div className={style.inspectionStatus}>
                {inspectionProgress === inspectionStatus.PROGRESS && (
                  <>
                    <h4>Inspection in progress</h4>
                    <span className={style.blinkingDot}></span>
                  </>
                )}
                {inspectionProgress === inspectionStatus.COMPLETED && (
                  <>
                    <h4>Inspection completed</h4>
                    <Link href={`/inspection/${inspectionId}`} passHref>
                      <a
                        onClick={() =>
                          setInspectionProgress(inspectionStatus.HIDDEN)
                        }
                      >
                        VIEW
                      </a>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          {/* .calendar */}
          <div className={style.reports}>
            <div className={style.header}>
              <div className={style.headerLeft}>
                <h4>{dateData.length}</h4>
                <h5>Reports found</h5>
              </div>
              {/* .left */}
              <div className={style.headerRight}>
                <h5>{moment(selectedDate).format("DD MMMM YYYY")}</h5>
              </div>
              {/* .right */}
            </div>
            {/* .header */}
            {busy ? (
              <div
                className={style.loadingWrapper}
                style={{ marginTop: "100px" }}
              >
                <Loading height={15} />
              </div>
            ) : (
              <div className={style.cards}>
                {dateData.map((d, di) => {
                  return <FieldCard key={di} data={d} />;
                })}
              </div>
            )}
          </div>
        </main>
      </div>
      {/* .dashboard */}

      {uploadOverlay && file && (
        <div onClick={handleOverlay} className={style.uploadOverlay}>
          <div ref={uploadWindow} className={style.uploadWindow}>
            <div className={style.uploadWindowHeader}>
              <h4>Video Upload</h4>
              <button onClick={closeUploadOverlay}>
                <Image src="/images/close.svg" alt="" width={14} height={16} />
              </button>
            </div>
            {/* .uploadWindowHeader */}
            <div className={style.form}>
              <div className={style.inputGroup}>
                <label>Field Name</label>
                <Dropdown
                  data={fields}
                  value={selectedField}
                  onSelection={setSelectedField}
                />
              </div>
              {/* .inputGroup */}
              <div className={style.inputGroup}>
                <label>Crop Type</label>
                <Dropdown
                  data={crops}
                  value={selectedCrop}
                  onSelection={setSelectedCrop}
                />
              </div>
              {/* .inputGroup */}
              <div className={style.changeVideo}>
                <div className={style.fileDetails}>
                  <h4>{file.name}</h4>
                  <h4>{humanFileSize(file.size)}</h4>
                </div>
                {/* .fileDetails */}
                <button
                  onClick={openFileDialog}
                  className={style.changeVideoButton}
                >
                  Change video
                </button>
              </div>
              {/* .changeVideo */}
              <button
                type="button"
                onClick={upload}
                className={style.uploadInspectButton}
              >
                Upload & Start Inspection
              </button>
            </div>
          </div>
          {/* .uploadWindow */}
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;

export function getServerSideProps(ctx) {
  const { authKey } = ctx.req.cookies;
  if (authKey) {
    return { props: { authKey: ctx.req.cookies.authKey || null } };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    };
  }
}
