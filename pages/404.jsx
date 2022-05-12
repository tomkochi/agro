const NotFound = () => {
	return (
		<div className="notfound">
			<h1>Opps!</h1>
			<h2>The page you are looking for doesn&apost exists.</h2>
			<style jsx>{`
				.notfound {
					width: 100%;
					height: 100vh;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
				}
				h1 {
					text-align: center;
					font-size: 48px;
					margin-bottom: 32px;
				}
				h2 {
					text-align: center;
				}
			`}</style>
		</div>
	);
};

export default NotFound;
