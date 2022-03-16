import { useEffect } from "react";
import "../styles/globals.css";
import "../styles/reset.scss";
import useStore from "../store";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const authRoutes = useStore((state) => state.authRoutes);
  return <Component {...pageProps} />;
}

export default MyApp;
