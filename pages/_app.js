import "../styles/globals.css";
import "../styles/reset.scss";

function MyApp({ Component, pageProps, user, authKey }) {
	return <Component {...pageProps} />;
}

export default MyApp;
