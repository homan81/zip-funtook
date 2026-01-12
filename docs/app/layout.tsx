import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import AuthStatus from "./components/admin/AuthStatus";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Funtook",
  description: "Funtook Platform",
  icons: {
    icon: "/assets/white_logo.svg", // or "/logo.png"
    shortcut: "/assets/white_logo.svg",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="">
      {/* <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}> */}
        <Providers>
          <AuthStatus />
          {children}
        </Providers>
      </body>
    </html>
  );
}
