import Image from "next/image";

export default function OurValues() {
  return (
    <section className=" bg-[#A54E5A] py-12">
      <div className="container mx-auto px-4 text-center text-white">

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-10">Our Value</h2>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-10">

          {/* Item 1 */}
          <div className="flex flex-col items-center gap-3">
            <Image
              src="/assets/about-imgs/icons/codicon_workspace-trusted.svg"
              alt="Trusted Websites"
              width={40}
              height={40}
            />
            <p className="text-sm">100% Trusted Websites</p>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col items-center gap-3">
            <Image
              src="/assets/about-imgs/icons/streamline-cyber_cash-hand-4.svg"
              alt="COD Booking"
              width={40}
              height={40}
            />
            <p className="text-sm">COD Accepted Booking</p>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col items-center gap-3">
            <Image
              src="/assets/about-imgs/icons/carbon_location-company.svg"
              alt="5 Year Brand"
              width={40}
              height={40}
            />
            <p className="text-sm">5+ Year Old Brand</p>
          </div>

          {/* Item 4 */}
          <div className="flex flex-col items-center gap-3">
            <Image
              src="/assets/about-imgs/icons/hugeicons_man.svg"
              alt="Clients"
              width={40}
              height={40}
            />
            <p className="text-sm">Serving 5000+ Clients Per Year</p>
          </div>

          {/* Item 5 */}
          <div className="flex flex-col items-center gap-3">
            <Image
              src="/assets/about-imgs/icons/file-icons_easybuild.svg"
              alt="Planning"
              width={40}
              height={40}
            />
            <p className="text-sm">Easy and Hassle Free Planning</p>
          </div>

          {/* Item 6 */}
          <div className="flex flex-col items-center gap-3">
            <Image
              src="/assets/about-imgs/icons/streamline-sharp_share-time.svg"
              alt="Planning"
              width={40}
              height={40}
            />
            <p className="text-sm">Easy and Hassle Free Planning</p>
          </div>

        </div>
      </div>
    </section>
  );
}
