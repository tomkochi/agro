import axios from "axios";
import moment from "moment";

export async function serversideValidation(ctx) {
	const { authKey } = ctx.req.cookies;

	if (authKey) {
		// validate user
		try {
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
			if (r.data.success) {
				return {
					props: {
						proceed: true,
						authKey: ctx.req.cookies.authKey || null,
						userObject: r.data.data.user.account,
						date:
							ctx.query.d === undefined
								? moment().startOf("day").unix() * 1000
								: parseInt(ctx.query.d),
					},
				};
			} else {
				// delete cookie
				fetch("/api/logout", {
					method: "post",
				}).then(() => {
					return {
						redirect: {
							permanent: false,
							destination: "/login",
						},
						props: { proceed: false },
					};
				});
			}
		} catch (error) {
			console.log(error);
			// network error - server down or whatall
			return {
				redirect: {
					permanent: false,
					destination: "/404",
				},
				props: { proceed: false },
			};
		}
	} else {
		return {
			redirect: {
				permanent: false,
				destination: "/login",
			},
			props: { proceed: false },
		};
	}
}
