// import Image from "next/image";
import BirthdayDeco from "@/app/(site)/components/Home/birthday_deco";
import Explore from "@/app/(site)/components/Home/explore";
import ImageSlider from "@/app/(site)/components/imageslider/ImageSlider";
import Anniversary_deco from "./components/Home/Anniversary_deco";
import New_Collections from "./components/Home/New_Collections";
import Surprise_Love from "./components/Home/Surprise_Love";
import Kids_Birthday from "./components/Home/Kids_Birthday";
import Baby_Decor from "./components/Home/Baby_Decor";
import Baby_Shower from "./components/Home/Baby_Shower";
import Hampers from "./components/Home/Hampers";
import Service_Bars from "./components/Home/Service_Bars";
import Customers from "./components/About/Customers";
import Section_11 from "./components/Home/Section_11";
import Freq_ques from "./components/Home/Freq_ques";
import Book_Decors from "./components/Home/Book _Decors";
import Mobilebottomtabs from "./components/Mobilebottomtabs/Mobilebottomtabs";
import Weeding_Special from "./components/Home/Weeding_Special";
import Corporate_Events from "./components/Home/Corporate_Events";
import Car_Boot_Decor from "./components/Home/Car_Boot_Decor";

export default function Home() {
  return (
    <main>
      <ImageSlider />
      <Explore />
      <BirthdayDeco />
      <Anniversary_deco />
      <Weeding_Special />
      <New_Collections />
      <Corporate_Events />
      <Car_Boot_Decor />
      <Surprise_Love />
      <Kids_Birthday />
      <Baby_Decor />
      <Baby_Shower />
      <Hampers />
      <Service_Bars />
      <Customers />
      <Section_11 />
      <Freq_ques />
      <Book_Decors />
      <Mobilebottomtabs />
    </main>
  );
}
