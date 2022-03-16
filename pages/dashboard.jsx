import axios from "axios";
import style from "./dashboard.module.scss";
import Calendar from "../components/calendar";
import Layout from "../components/layout";
import Image from "next/image";
import FieldCard from "../components/dashboard/fieldCard";
import "react-dropdown/style.css";
import { useRef, useState, useEffect } from "react";
import Progress from "../components/dashboard/progress";
import useStore from "../store";
import { useRouter } from "next/router";

const Dashboard = () => {
  const router = useRouter();

  const authkey = useStore((state) => state.authkey);
  const busy = useStore((state) => state.busy);
  const user = useStore((state) => state.user);
  const setBusy = useStore((state) => state.setBusy);

  const [file, setFile] = useState(null);
  const [uploadOverlay, setUploadOverlay] = useState(false);

  const fields = user.account.croptype;
  const crops = user.account.fields;

  const [fieldOpen, setFieldOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(fields[0]);

  const [cropOpen, setCropOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(crops[0]);

  const [fieldFilterOpen, setFieldFilterOpen] = useState(false);
  const [selectedFieldFilter, setSelectedFieldFilter] = useState(fields[0]);

  const [uploading, setUploading] = useState(false);
  const [upSize, setUpSize] = useState(0);

  const fileInput = useRef(null);
  const fieldWrapper = useRef(null);
  const cropWrapper = useRef(null);
  const uploadWindow = useRef(null);
  const fieldFilterWrapper = useRef(null);

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

  const setUploadField = (f) => {
    setSelectedField(f);
    setFieldOpen(false);
  };

  const setUploadCrop = (f) => {
    setSelectedCrop(f);
    setCropOpen(false);
  };

  const setFieldFilter = (f) => {
    setSelectedFieldFilter(f);
    setFieldFilterOpen(false);
  };

  const documentClick = (e) => {
    if (fieldWrapper.current && !fieldWrapper.current.contains(e.target)) {
      setFieldOpen(false);
    }
    if (cropWrapper.current && !cropWrapper.current.contains(e.target)) {
      setCropOpen(false);
    }
    if (
      fieldFilterWrapper.current &&
      !fieldFilterWrapper.current.contains(e.target)
    ) {
      setFieldFilterOpen(false);
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
    var formData = new FormData();
    formData.append("video", file);
    axios({
      method: "post",
      url: "http://localhost:3000/api/file",
      data: formData,
      onUploadProgress: (e) => {
        setUpSize(e.loaded);
      },
      headers: {
        content_type: "miltipart/form-data",
      },
    })
      .then((e) => {
        console.log("Success!");
        // console.log(e);
        setUploadOverlay(false);
        setUploading(true);
      })
      .catch((e) => {
        console.log("Error");
        // console.log(e);
      });
  };

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    if (!uploadOverlay) fileInput.current.value = null;
  }, [uploadOverlay]);

  return (
    <Layout title="Dashboard" bg="#F3F3F3">
      <div className={style.dashboard}>
        <header>
          <div className={style.status}>
            {uploading && <Progress size={file.size} done={upSize} />}
          </div>
          <input ref={fileInput} type="file" hidden onChange={handleFile} />
          <button onClick={openFileDialog} className={style.videoButton}>
            Select video
          </button>
        </header>
        <main>
          <div className={style.leftPanel}>
            <div className={style.fieldFilter}>
              <div
                ref={fieldFilterWrapper}
                className={style.fieldFilterWrapper}
              >
                <button
                  onClick={() => setFieldFilterOpen((c) => !c)}
                  className={`${style.dropdown} ${
                    fieldFilterOpen ? style.open : ""
                  }`}
                >
                  {selectedFieldFilter.name}
                </button>
                <div
                  className={`${style.menu} ${
                    fieldFilterOpen ? style.open : ""
                  }`}
                >
                  {fields.map((f) => {
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
              {/* .dropdownWrapper */}
            </div>
            {/* .inputGroup */}
            <Calendar />
          </div>
          {/* .calendar */}
          <div className={style.reports}>
            <div className={style.header}>
              <div className={style.headerLeft}>
                <h4>3</h4>
                <h5>Reports found</h5>
              </div>
              {/* .left */}
              <div className={style.headerRight}>
                <button className={style.showChart}>
                  <Image
                    src="/images/chart-icon.svg"
                    alt=""
                    width={18}
                    height={10}
                  />
                  <h5>15 April 2021</h5>
                </button>
              </div>
              {/* .right */}
            </div>
            {/* .header */}
            <div className={style.cards}>
              <FieldCard />
              <FieldCard />
              <FieldCard />
            </div>
            {/* .body */}
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
                <div ref={fieldWrapper} className={style.dropdownWrapper}>
                  <button
                    onClick={() => setFieldOpen((c) => !c)}
                    className={`${style.dropdown} ${
                      fieldOpen ? style.open : ""
                    }`}
                  >
                    {selectedField.name}
                  </button>
                  <div
                    className={`${style.menu} ${fieldOpen ? style.open : ""}`}
                  >
                    {fields.map((f) => {
                      return (
                        <button
                          key={f._id}
                          onClick={() => setUploadField(f)}
                          className={style.menuItem}
                        >
                          {f.name}
                        </button>
                      );
                    })}
                  </div>
                  {/* .menu */}
                </div>
                {/* .dropdownWrapper */}
              </div>
              {/* .inputGroup */}
              <div className={style.inputGroup}>
                <label>Crop Type</label>
                <div ref={cropWrapper} className={style.dropdownWrapper}>
                  <button
                    onClick={() => setCropOpen((c) => !c)}
                    className={`${style.dropdown} ${
                      cropOpen ? style.open : ""
                    }`}
                  >
                    {selectedCrop.name}
                  </button>
                  <div
                    className={`${style.menu} ${cropOpen ? style.open : ""}`}
                  >
                    {crops.map((c) => {
                      return (
                        <button
                          key={c._id}
                          onClick={() => setUploadCrop(c)}
                          className={style.menuItem}
                        >
                          {c.name}
                        </button>
                      );
                    })}
                  </div>
                  {/* .menu */}
                </div>
                {/* .dropdownWrapper */}
              </div>
              {/* .inputGroup */}
              <div className={style.changeVideo}>
                <div className={style.fileDetails}>
                  <h4>{file.name}</h4>
                  <h4>{humanFileSize(file.size)}</h4>
                </div>
                {/* .fileDetails */}
                <button onClick={openFileDialog} className={style.videoButton}>
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
