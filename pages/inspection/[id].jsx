import style from "./[id].module.scss";
import Layout from "../../components/layout";
import { useState, useEffect } from "react";
import moment from "moment";
import PageHeader from "../../components/header";
import axios from "axios";

const Inspection = ({ authKey, images, data }) => {
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

	return (
		<Layout title="Gallery" bg="#F3F3F3">
			<PageHeader title="Gallery" />
			<div className={style.gallery}>
				<div className={style.views}>
					<button className={style.active}>Gallery</button>
					<button>Map view</button>
				</div>
				{/* .views */}
				<h4>
					{moment.unix(data.date).format("MMMM Do YYYY, h:mm a")} | Croptype :{" "}
					{data.croptype} | Field : {data.field}
				</h4>
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
									stroke="#69AA72"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
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
									stroke="#69AA72"
									strokLinecap="round"
									strokLinejoin="round"
								/>
							</svg>
						</button>
						{/* .navRight */}
						<div className={style.mobileNavs}>
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
										stroke="#69AA72"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>
							{/* .navLeft */}
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
										stroke="#69AA72"
										strokLinecap="round"
										strokLinejoin="round"
									/>
								</svg>
							</button>
							{/* .navRight */}
						</div>
						{/* .mobileNavs */}
					</div>
				)}
			</div>
		</Layout>
	);
};

export default Inspection;

export async function getServerSideProps(ctx) {
	const { authKey } = ctx.req.cookies;
	if (authKey) {
		const r = await axios({
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/data/inspection`,
			method: "post",
			headers: {
				content_type: "application/json",
				authKey: ctx.req.cookies.authKey,
			},
			data: {
				inspectionid: ctx.params.id,
			},
		});
		console.log(r.data.data);
		if (!r.data.data.status) {
			return {
				redirect: {
					permanent: false,
					destination: "/404",
				},
				props: {},
			};
		} else {
			return {
				props: {
					authKey: ctx.req.cookies.authKey || null,
					images: r.data.data.result.images,
					data: r.data.data,
				},
			};
		}
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
