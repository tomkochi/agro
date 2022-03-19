import Head from "next/head";

export default function Layout({ title, bg, children }) {
  return (
    <div className="layout">
      <Head>
        <title>{title} - Agrofocal</title>
      </Head>
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
