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
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Loading from "../components/loading";
import { userStore, globalStore } from "../store";

const Dashboard = ({ authKey }) => {
	const router = useRouter();

	const controller = useRef(null); // for aborting upload

	const inspectionInterval = useRef(null); // check for inspection data

	const all = { _id: 0, name: "All" };

	// store
	const user = userStore((state) => state.user);
	const selectedField = globalStore((state) => state.selectedField);
	const setSelectedField = globalStore((state) => state.setSelectedField);
	const selectedCrop = globalStore((state) => state.selectedCrop);
	const setSelectedCrop = globalStore((state) => state.setSelectedCrop);

	const [busy, setBusy] = useState(false);

	const [inspectionData, setInspectionData] = useState({});

	const [selectedUploadField, setSelectedUploadField] = useState(null);
	const [selectedUploadCrop, setSelectedUploadCrop] = useState(null);

	const [monthData, setMonthData] = useState([]); // which all dates of this month has data
	const [dateData, setDateData] = useState([]); // selected day's data

	const [file, setFile] = useState(null); // selected file stored in here
	const [uploadOverlay, setUploadOverlay] = useState(false); // whether to show upload overlay box after choosing the file

	const [selectedFieldFilter, setSelectedFieldFilter] = useState(all);

	const [uploadArea, setUploadArea] = useState("");
	const [uploadDate, setUploadDate] = useState(null);

	const [uploading, setUploading] = useState(false); // decides whether to show upload status indicator
	const [upSize, setUpSize] = useState(0); // uploaded size - from upload progress
	const [totalSize, setTotalSize] = useState(0); // size of the file from upload progress

	const [loaded, setLoaded] = useState(false);

	const fileInput = useRef(null);
	const fieldWrapper = useRef(null);
	const cropWrapper = useRef(null);
	const uploadWindow = useRef(null);

	const [selectedDate, setSelectedDate] = useState(() => {
		return parseInt(router.query.d) || moment().startOf("day").unix() * 1000;
	});

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
	const abortUploading = () => {
		if (controller.current) {
			controller.current.abort("Operation ended by user.");
		}
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

	const uploadDateChange = (e) => {
		setUploadDate(moment(e.target.value).unix() * 1000);
	};

	const upload = (e) => {
		if (moment(uploadDate).isAfter(moment())) {
			alert("Future date selected");
			return;
		}
		let formData = new FormData();
		formData.append("file", file);
		formData.append("cropid", selectedUploadCrop._id);
		formData.append("cropname", selectedUploadCrop.name);
		formData.append("fieldid", selectedUploadField._id);
		formData.append("acres", uploadArea);
		formData.append("date", uploadDate);

		controller.current = new AbortController();

		axios({
			method: "post",
			url: `${process.env.NEXT_PUBLIC_UPLOAD_URL}/inspection/upload`,
			data: formData,
			signal: controller.current.signal,
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
					checkInspections();
				} else {
					alert(ur.data.msg.msg);
				}
			})
			.catch((e) => {
				console.log(e);
				if (e.message == "canceled") {
					// alert("Uploading cancelled by the user.");
				} else {
					// alert(e.message);
				}
			})
			.finally(() => {
				setUploading(false);
			});
		setUploadOverlay(false);
		setUploading(true);
	};

	const fetchDateData = (date, hasData) => {
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
				field: selectedField._id === 0 ? [] : [selectedField._id],
				cropid: selectedCrop._id === 0 ? null : selectedCrop._id,
			},
		})
			.then((r) => {
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
				// truncate time from response
				let tmp = [];
				r.data.data.map((d) => {
					const localTime = moment.utc(d).local().format("YYYY/MM/DD");
					tmp.push(localTime);
				});
				setMonthData(tmp);
			})
			.catch((e) => alert(e));
	};

	const checkInspections = () => {
		axios({
			method: "post",
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/inspection`,
			data: {},
			headers: {
				content_type: "application/json",
				authKey,
			},
		})
			.then((r) => {
				setInspectionData(r.data.data);
			})
			.catch((e) => console.log(e));
	};

	const areaChange = (e) => {
		const re = /^[0-9\b.]+$/;
		if (e.target.value === "" || re.test(e.target.value)) {
			setUploadArea(e.target.value);
		}
	};

	const uploadingTime = () => {
		if (moment(selectedDate).isSame(moment(), "day")) {
			return moment().format("YYYY-MM-DD[T]HH:mm");
		} else {
			return moment(selectedDate).format("YYYY-MM-DD[T]09:00");
		}
	};

	const fieldChange = (f) => {
		setSelectedField(f);
	};

	const cropChange = (c) => {
		setSelectedCrop(c);
	};

	// [router.query]
	useEffect(() => {
		const newDate =
			router.query.d === undefined
				? moment().startOf("day").unix() * 1000
				: parseInt(router.query.d);
		setSelectedDate(newDate);
		// getMonthData(newDate);
		fetchDateData(newDate, true);
	}, [router.query]);

	// [user]
	useEffect(() => {
		if (user) {
			setSelectedUploadField(user.fields[0]);
			setSelectedUploadCrop(user.croptype[0]);
		}
	}, [user]);

	// [uploadOverlay]
	useEffect(() => {
		setUploadDate(selectedDate);
		if (!uploadOverlay) {
			fileInput.current.value = "";
		}
	}, [uploadOverlay]);

	useEffect(() => {
		if (loaded) {
			fetchDateData(selectedDate, true);
		}
	}, [selectedCrop, selectedField]);

	// []
	useEffect(() => {
		checkInspections();

		setLoaded(true);

		document.addEventListener("click", documentClick);

		return () => {
			document.removeEventListener("click", documentClick);
			clearInterval(inspectionInterval.current);
			try {
				controller.current.abort();
			} catch (error) {}
		};
	}, []);

	return (
		<Layout title="Dashboard" bg="#F3F3F3">
			<div className={style.wrapper}>
				<PageHeader title="Dashboard" authKey={authKey}>
					{uploading ? (
						<button
							onClick={abortUploading}
							className={style.abortUploadButton}
						>
							<span>Abort uploading</span>
						</button>
					) : (
						<button
							onClick={openFileDialog}
							className={style.selectVideoButton}
							disabled={uploading}
						>
							<span>Select video</span>
						</button>
					)}
				</PageHeader>
				<div className={style.dashboard}>
					{uploading && (
						<div className={style.statusWrapper}>
							<div className={style.status}>
								<Progress size={totalSize} done={upSize} />
							</div>
						</div>
					)}
					<input ref={fileInput} type="file" hidden onChange={handleFile} />
					<main>
						<div className={style.leftPanel}>
							<div className={style.dataControls}>
								<div className={style.fieldFilter}>
									<Dropdown
										data={user ? [all, ...user.croptype] : [all]}
										value={selectedCrop}
										onSelection={cropChange}
										label="Crops"
									/>
								</div>
								<div className={style.fieldFilter}>
									<Dropdown
										data={user ? [all, ...user.fields] : [all]}
										value={selectedField}
										onSelection={fieldChange}
										label="Fields"
									/>
								</div>
								<Calendar
									selectedDate={selectedDate}
									setSelectedDate={setSelectedDate}
									monthData={monthData}
									getMonthData={getMonthData}
									fetchDateData={fetchDateData}
									calendarDisplay={{
										year: parseInt(moment(selectedDate).format("YYYY")),
										month: parseInt(moment(selectedDate).format("M")),
									}}
								/>
							</div>
							{/* .dataControls */}
							<div className={style.inspectionWrapper}>
								<div className={style.inspections}>
									{Object.entries(inspectionData).length > 0 && (
										<div className={style.inspectionStatus}>
											{Object.entries(inspectionData).map((id, idi) => {
												return (
													<div className={style.inspection} key={idi}>
														{id[1].status === "Analysis Completed" ? (
															<>
																<h4>Inspection completed</h4>
																<Link href={`/inspection/${id[0]}`} passHref>
																	<a>VIEW</a>
																</Link>
															</>
														) : (
															<>
																<h4>Inspection in progress</h4>
																<span className={style.blinkingDot}></span>
															</>
														)}
													</div>
												);
											})}
										</div>
									)}
								</div>
								{/* .inspections */}
							</div>
						</div>
						{/* .leftPanel */}
						<div className={style.reports}>
							<div className={style.header}>
								<div className={style.headerLeft}>
									<img src="/images/calendar-grey.svg" alt="" />
									<h3>{moment(selectedDate).format("DD MMM, YYYY")}</h3>
									<h4>{dateData.length}</h4>
									<h5>Reports found</h5>
								</div>
								{/* .left */}
								<div className={style.headerRight}>
									<Link
										href={{
											pathname: "/chart",
											query: {
												d: moment(selectedDate).startOf("day").unix() * 1000,
											},
										}}
										passHref
									>
										<a>Reports</a>
									</Link>
								</div>
								{/* .right */}
							</div>
							{/* .header */}
							<div className={style.cardsWrapper}>
								<div className={style.cards}>
									<div className={style.dummy}>
										{dateData
											.sort((a, b) => (a.date > b.date ? -1 : 1))
											.map((d, di) => {
												return <FieldCard key={di} data={d} />;
											})}
									</div>
									{/* .dummy */}
								</div>
								{/* .cards */}
							</div>
							{/* .cardsWrappers */}
						</div>
						{/* .reports */}
					</main>
				</div>
				{/* .dashboard */}
			</div>
			{/* .wrapper */}
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
									data={user.fields}
									value={selectedUploadField}
									onSelection={setSelectedUploadField}
								/>
							</div>
							{/* .inputGroup */}

							<div className={style.inputGroup}>
								<label>Crop Type</label>
								<Dropdown
									data={user.croptype}
									value={selectedUploadCrop}
									onSelection={setSelectedUploadCrop}
								/>
							</div>
							{/* .inputGroup */}

							<div className={style.inputGroup}>
								<label>Acre</label>
								<input
									type="number"
									name="acres"
									className={style.area}
									value={uploadArea}
									onChange={areaChange}
									placeholder="0.00"
								/>
							</div>
							{/* .inputGroup */}

							<div className={style.inputGroup}>
								<input
									type="datetime-local"
									name="date"
									className={style.datetime}
									defaultValue={uploadingTime()}
									max={moment().format("YYYY-MM-DD[T]HH:mm")}
									onChange={uploadDateChange}
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
				destination: "/login",
			},
			props: {},
		};
	}
}
