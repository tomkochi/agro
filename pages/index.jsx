import axios from "axios";
import style from "./index.module.scss";
import Calendar from "../components/calendar";
import Layout from "../components/layout";
import Image from "next/image";
import FieldCard from "../components/dashboard/fieldCard";
import "react-dropdown/style.css";
import { useRef, useState, useEffect } from "react";
import Progress from "../components/dashboard/progress";

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [uploadOverlay, setUploadOverlay] = useState(false);

  const fields = ["One", "Two", "Three"];
  const crops = ["One", "Two", "Three"];

  const [fieldOpen, setFieldOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(fields[0]);

  const [cropOpen, setCropOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(crops[0]);

  const [uploading, setUploading] = useState(false);
  const [upSize, setUpSize] = useState(0);

  const fileInput = useRef(null);
  const fieldWrapper = useRef(null);
  const cropWrapper = useRef(null);
  const uploadWindow = useRef(null);

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
    var formData = new FormData();
    formData.append("video", file);
    axios({
      method: "post",
      url: "http://localhost:3000/api/file",
      data: formData,
      onUploadProgress: (e) => {
        console.log(e.loaded);
      },
      headers: {
        content_type: "miltipart/form-data",
      },
    })
      .then((e) => {
        console.log("Success!");
        console.log(e);
      })
      .catch((e) => {
        console.log("Error");
        console.log(e);
      });
  };

  useEffect(() => {
    document.addEventListener("click", documentClick);
    return () => document.removeEventListener("click", documentClick);
  }, []);

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
          <div className={style.calendar}>
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
                    {selectedField}
                  </button>
                  <div
                    className={`${style.menu} ${fieldOpen ? style.open : ""}`}
                  >
                    {fields.map((f, fi) => {
                      return (
                        <button
                          key={fi}
                          onClick={() => setUploadField(f)}
                          className={style.menuItem}
                        >
                          {f}
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
                    {selectedCrop}
                  </button>
                  <div
                    className={`${style.menu} ${cropOpen ? style.open : ""}`}
                  >
                    {fields.map((f, fi) => {
                      return (
                        <button
                          key={fi}
                          onClick={() => setUploadCrop(f)}
                          className={style.menuItem}
                        >
                          {f}
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
