import Header from "./header";
import Head from "next/head";

export default function Layout({ title, bg, children }) {
  return (
    <div className="layout">
      <Head>
        <title>{title} - Agrofocal</title>
      </Head>
      <Header />
      <main>{children}</main>
      <style jsx>{`
        .layout {
          background: ${bg};
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
}
