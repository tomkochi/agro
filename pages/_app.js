import { useEffect } from "react";

import axios from "axios";

import "../styles/globals.css";
import "../styles/reset.scss";
import { userStore } from "../store";

function MyApp({ Component, pageProps, user }) {
	const setUser = userStore((state) => state.setUser);

	useEffect(() => {
		if (user !== undefined) {
			setUser(user);
		}
	}, []);

	return <Component {...pageProps} />;
}

export default MyApp;

MyApp.getInitialProps = async ({ ctx }) => {
	const authKey = ctx.req?.cookies?.authKey || null;
	if (authKey) {
		const r = await axios({
			url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/validate`,
			method: "post",
			data: {
				authKey: authKey,
			},
			headers: {
				content_type: "application/json",
				authKey,
			},
		});
		return { user: r.data.data.user.account };
	} else {
		return {};
	}
};
