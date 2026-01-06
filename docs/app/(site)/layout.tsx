import type { Metadata } from "next";
import { Roboto } from "next/font/google";
//import Header from "../app/components/header";
//import Footer from "@/app/components/footer";
//import Header from "./components/header";
// import Header from "@/app/components/header";
// import Footer from "./components/footer";
//import "./globals.css";
import Header from "@/app/(site)/components/header";
import Footer from "@/app/(site)/components/footer";
import Mobilebottomtabs from "./components/Mobilebottomtabs/Mobilebottomtabs";


const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Funtook",
  description: "Funtook",
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${roboto.variable} bg-white scroll-smooth`}>
      <Header />
      {children}
      <Footer />
      <Mobilebottomtabs/>
    </div>
  );
}
