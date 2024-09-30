import type { Metadata } from "next";
import Head from "next/head"
import { Inter } from "next/font/google";
import "./globals.scss";
import Nav from "@/app/components/Nav";
import Script from 'next/script'
import Providers from '@/app/components/providers'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Climbing Topos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <script>
          // window.global = window;
          // var exports = {};
        </script>
      </Head>
      <body className={inter.className}>
        <Script src="https://kit.fontawesome.com/4b877c229a.js" crossOrigin="anonymous" />
        <Nav />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
