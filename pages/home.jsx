import styles from "./index.module.scss";
import style from "../components/header.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";

export default function home() {
  return (
    <div className={styles.bg}>
      <HeaderHome />
    </div>
  );
}

export function HeaderHome({ children }) {
  const router = useRouter();
  return (
    <div className={style.header}>
      <div className={style.left}>
        <div className={style.logo}>
          <Link href="/" passHref>
            <img src="/images/logo.svg" width={140} alt="" />
          </Link>
        </div>
        {/* .currentPosition */}
      </div>
      {/* .left */}
      <div className={style.right}>
        {children}
        <div className={style.loggedIn}>
          <button className={style.logout} onClick={() => router.push("/")}>
            Login
          </button>
        </div>
      </div>
      {/* .right */}
    </div>
  );
}
