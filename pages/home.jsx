import style from "./home.module.scss";
import Layout from "../components/layout";
import Header from "../components/guestHeader";
import Link from "next/link";
import { useEffect, useState } from "react";

const Home = () => {
	const [scrollY, setScrollY] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			setScrollY(window.scrollY);
		};

		setScrollY(window.scrollY);

		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<Layout title="Welcome">
			<div className={style.home} id="home">
				<section className={style.hero}>
					<div
						className={style.image1}
						style={{ height: `calc(100vh - ${scrollY}px)` }}
					></div>
					<div
						className={style.image2}
						style={{ height: `calc(100vh - ${scrollY / 1.5}px)` }}
					></div>
					<div
						className={style.image3}
						style={{ height: `calc(100vh - ${scrollY / 2}px)` }}
					></div>
					<div
						className={style.image4}
						style={{ height: `calc(100vh - ${scrollY / 4}px)` }}
					></div>
					<Header />
					<div className={style.contents}>
						<div className={style.logo}>
							<img src="/images/logo.svg" alt="" />
						</div>
						{/* .logo */}
						<h1>
							Unleashing technology to solve problems fundamental to our
							existence
						</h1>
					</div>
					{/* .contents */}
				</section>
				{/* .hero */}
				<div className="container">
					<section className={style.whyAgrofocal}>
						<h2>Why Agrofocal? </h2>
						<p>
							Agrofocal is building a crop monitoring system that is easy to
							mount on any farm vehicle and that provides insights on yield and
							crop health in real time.
						</p>
						<p>
							These insights will enable farmers to make informed decisions that
							will increase production, reduce costs, and lessen environmental
							impact
						</p>
						<div className={style.points}>
							<div className={style.point}>
								<img src="/images/realtime.svg" alt="" />
								<h3>Realtime</h3>
							</div>
							{/* .point */}
							<div className={style.point}>
								<img src="/images/easy-to-use.svg" alt="" />
								<h3>Easy to use</h3>
							</div>
							{/* .point */}
							<div className={style.point}>
								<img src="/images/tractor.svg" alt="" />
								<h3>Seamless Integration </h3>
							</div>
							{/* .point */}
						</div>
						{/* .points */}
					</section>
					{/* .whyAgrofocal */}
					<section className={style.supportedCrops}>
						<h3>Crops we support</h3>
						<div className={style.crops}>
							<div className={style.crop}>
								<img src="/images/crop-1.png" alt="" />
							</div>
							{/* .crop */}
							<div className={style.crop}>
								<img src="/images/crop-2.png" alt="" />
							</div>
							{/* .crop */}
							<div className={style.crop}>
								<img src="/images/crop-3.png" alt="" />
							</div>
							{/* .crop */}
						</div>
						{/* .crops */}
					</section>
					{/* .supportedCrops */}
				</div>
				{/* .container */}
				<div className={style.learnMore}>
					<h3>Learn more?</h3>
					<Link href="/contact" passHref>
						<a>Contact</a>
					</Link>
				</div>
				{/* .learnMore */}
				<footer>
					<div className={style.image}>
						<img src="/images/logo.svg" alt="" />
					</div>
					<p>&copy; Agrofocal 2022. All Rights Reserved. </p>
				</footer>
			</div>
			{/* .home */}
		</Layout>
	);
};

export default Home;
