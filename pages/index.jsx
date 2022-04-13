import style from "./index.module.scss";
import Layout from "../components/layout";
import Header from "../components/guestHeader";

const Home = ({ authKey }) => {
	return (
		<Layout title="Welcome">
			<div className={style.home}>
				<section className={style.hero}>
					<Header authKey={authKey} />
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
							Agrofocal enables farmers to make informed decisions based on
							objective crop measurements. Thus increase production, reduce
							costs, and lessen environmental impact.{" "}
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
								<img src="/images/affordable.svg" alt="" />
								<h3>Affordable </h3>
							</div>
							{/* .point */}
						</div>
						{/* .points */}
					</section>
					{/* .whyAgrofocal */}
				</div>
				{/* .container */}
				<footer>
					<div className="container">
						<img src="/images/logo.svg" alt="" />
						<p>&copy; Agorofocal 2022. All Rights Reserved. </p>
					</div>
					{/* .container */}
				</footer>
			</div>
			{/* .home */}
		</Layout>
	);
};

export default Home;

export function getServerSideProps(ctx) {
	const { authKey } = ctx.req.cookies;
	if (authKey) {
		return {
			props: { authKey: ctx.req.cookies.authKey || null },
		};
	} else {
		return { props: {} };
	}
}
