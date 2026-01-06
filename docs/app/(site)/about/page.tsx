import Bannerabout from "../components/About/Bannerabout";
import Commitment from "../components/About/Commitment";
import Customers from "../components/About/Customers";
import OurStory from "../components/About/Ourstory";
import Ourvalues from "../components/About/Ourvalues";


export default function About() {
  return (
    <div>
      <Bannerabout />
      <OurStory />
      <Commitment />
      <Ourvalues/>
      <Customers/>
    </div>
  )
}

