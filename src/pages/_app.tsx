import React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ClerkProvider>
            <Component {...pageProps} />
            <ToastContainer />
        </ClerkProvider>
    );
}
