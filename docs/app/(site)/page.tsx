// import Image from "next/image";
import BirthdayDeco from "@/app/(site)/components/Home/birthday_deco";
import Explore from "@/app/(site)/components/Home/explore";
import ImageSlider from "@/app/(site)/components/imageslider/ImageSlider";


export default function Home() {
  return (
        <main>
          <ImageSlider/>
          <Explore />
          <BirthdayDeco />
        </main>
  );
}
