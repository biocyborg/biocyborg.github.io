import type { Metadata } from "next";
import localFont from "next/font/local";
import { ConfigProvider } from "antd";

import { Toaster } from "react-hot-toast";

import styles from "./layout.module.css";

import "@/styles/index.css";
import { config } from "./thirdpartyColorConfig";

const geistChakraPetch = localFont({
  src: "./fonts/ChakraPetch.ttf",
  variable: "--font-geist-ChakraPetch",
  weight: "100 900",
});
const geistProtestRevolution = localFont({
  src: "./fonts/ProtestRevolution.ttf",
  variable: "--font-geist-ProtestRevolution",
  weight: "100 900",
});

const geistAnton = localFont({
  src: "./fonts/Anton-Regular.ttf",
  variable: "--font-geist-Anton",
  weight: "100 900",
});

const geistJosefinSans = localFont({
  src: "./fonts/JosefinSansRegular.ttf",
  variable: "--font-geist-JosefinSans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ElkTop: Unlock Exclusive Offers",
  description:
    "Explore the best discounts with ElkTop. Use our plugin to quickly claim exclusive coupons and shop smarter. ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="verify-admitad" content="5af0702a27" />
      <ConfigProvider theme={config} wave={{ disabled: true }}>
        <body
          className={`${geistChakraPetch.variable} ${geistProtestRevolution.variable} ${geistAnton.variable} ${geistJosefinSans.variable} ${styles.container}`}
        >
          {/* <Header /> */}
          <div className={styles.content}>
            <div className={styles.sliding}>{children}</div>
            <Toaster position="top-center" reverseOrder={false} />
          </div>
        </body>
      </ConfigProvider>
    </html>
  );
}

// ar
// cn
// de
// es
// fr
// it
// jp
// kr
// nl
// pt
// us
