import Head from "next/head";
import Link from "next/link";
import React from "react";
import Navbar from "./navbar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Ecologistics Calendar</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div>{children}</div>
    </>
  );
};

export default Layout;
