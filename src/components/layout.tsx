import Head from "next/head";
import Link from "next/link";
import React from "react";

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
      {/* <div className="navbar">
        <Link href="/">Home</Link>
        <Link href="/calendar">Calendar</Link>
        <Link href="/about">About</Link>
        <Link href="/forgot_password">Forgot Password</Link>
        <Link href="/login">Login</Link>
        <Link href="/signup">Sign Up</Link>
        <Link href="/eventDetails">Event Details</Link>
        <Link href="/admin">Admin Page</Link>
      </div> */}
      <div>{children}</div>
    </>
  );
};

export default Layout;
