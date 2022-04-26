import Head from "next/head";

export default function Layout({ title, bg, children }) {
	return (
		<div className="layout">
			<Head>
				<title>{title} - Agrofocal</title>
			</Head>
			<main>{children}</main>
			<style jsx>{`
				html,
				.layout {
					background: ${bg};
					@media (min-width: 992px) {
						height: 100vh;
						overflow-y: hidden;
					}
				}
			`}</style>
		</div>
	);
}
