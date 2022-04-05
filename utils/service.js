export const checkAuth = (ctx) => {
  const { authKey } = ctx.req.cookies;
  if (authKey) {
    return { props: { authKey: ctx.req.cookies.authKey || null } };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    };
  }
};
