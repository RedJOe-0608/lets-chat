import React from "react";
import "../src/app/globals.css";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}