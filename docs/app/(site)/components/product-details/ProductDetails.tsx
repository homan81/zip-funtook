// "use client";
// import { useState } from "react";

// interface MicrolinkData {
//   title: string;
//   description: string;
//   url: string;
// }

// export default function Product() {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [sources, setSources] = useState<MicrolinkData[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [openAccordion, setOpenAccordion] = useState<number | null>(null); // Track which accordion is open

//   async function fetchMicrolinkData(url: string): Promise<MicrolinkData> {
//     return {
//       title: "Sample Title",
//       description: "This is sample data fetched for: " + url,
//       url,
//     };
//   }

//   function openModal() {
//     setModalOpen(true);
//   }

//   function closeModal() {
//     setModalOpen(false);
//   }

//   async function handleSourceClick(urls: string[]) {
//     setLoading(true);
//     setSources([]);
//     openModal();

//     const results = await Promise.all(
//       urls.map(async (url) => await fetchMicrolinkData(url))
//     );

//     setSources(results);
//     setLoading(false);
//   }

//   return (
//     <div className="max-w-3xl mx-auto">
//       <Accordion
//         title="About the Product"
//         isOpen={openAccordion === 0}
//         onClick={() =>
//           setOpenAccordion(openAccordion === 0 ? null : 0)
//         }
//       >
//         <p className="text-gray-700 text-[13px]">
//           Bring your space to life with vibrant, colorful decorations that
//           sparkle with joy and creativity. From bold balloons and radiant
//           lights to elegant drapes and fresh floral accents, every detail adds
//           charm and personality. Whether it’s a birthday, wedding, or festive
//           celebration, our colorful designs create a cheerful atmosphere filled
//           with warmth, happiness, and unforgettable visual delight.
//         </p>
//       </Accordion>

//       <Accordion
//         title="FAQs"
//         isOpen={openAccordion === 1}
//         onClick={() =>
//           setOpenAccordion(openAccordion === 1 ? null : 1)
//         }
//       >
//         <ul className="list-disc ml-5 text-[13px]  text-gray-700">
//           <li>How do I use this product?</li>
//           <li>Does it come with warranty?</li>
//           <li>Is it available in different colors?</li>
//         </ul>
//       </Accordion>

//       <Accordion
//         title="Shipping"
//         isOpen={openAccordion === 2}
//         onClick={() =>
//           setOpenAccordion(openAccordion === 2 ? null : 2)
//         }
//       >
//         <p className="text-gray-700 text-[13px]">
//           Standard delivery takes 3–5 business days. Free shipping on orders
//           above ₹999.
//         </p>
//       </Accordion>

//       <Accordion
//         title="Info"
//         isOpen={openAccordion === 3}
//         onClick={() =>
//           setOpenAccordion(openAccordion === 3 ? null : 3)
//         }
//       >
//         <p className="text-gray-700 text-[13px]">
//           For more information, feel free to reach out to our support team.
//         </p>
//       </Accordion>

//       {/* Modal */}
//       {modalOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-4 w-80 relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-in">
//             <button
//               onClick={closeModal}
//               className="absolute top-2 right-2 text-xl"
//             >
//               ×
//             </button>

//             <h2 className="text-lg font-semibold mb-3">Sources</h2>

//             {loading ? (
//               <p className="text-center">Loading…</p>
//             ) : (
//               <ul className="space-y-2">
//                 {sources.map((item, index) => (
//                   <li key={index} className="border p-2 rounded">
//                     <p className="font-medium">{item.title}</p>
//                     <p className="text-sm text-gray-600">{item.description}</p>
//                     <a
//                       href={item.url}
//                       className="text-blue-600 text-sm underline"
//                     >
//                       {item.url}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* --------------------------------------------
//    Accordion Component (Controlled)
// --------------------------------------------- */

// interface AccordionProps {
//   title: string;
//   children: React.ReactNode;
//   isOpen: boolean;
//   onClick: () => void;
// }

// function Accordion({ title, children, isOpen, onClick }: AccordionProps) {
//   return (
//     <div className="p-3 border-b border-[#DBDBDB]">
//       <button
//         onClick={onClick}
//         className="w-full flex justify-between items-center text-lg font-medium"
//       >
//         <span className="text-[15px] font-bold">{title}</span>
//         <span>{isOpen ? "-" : "+"}</span>
//       </button>

//       <div
//         className={`overflow-hidden transition-all duration-300 ease-in-out ${
//           isOpen ? "max-h-[500px] mt-2" : "max-h-0 mt-0"
//         }`}
//       >
//         <div
//           className={`transition-opacity duration-300 ${
//             isOpen ? "opacity-100" : "opacity-0"
//           }`}
//         >
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import Image from "next/image";

interface ProductDetailsProps {
  product: {
    productName: string;
    productImage: string;
    price: number;
    sellingPrice: number;
    slug: string;
    description?: string;
  };
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  console.log("Product received in UI 👉", product);

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Image */}
      <div>
        <Image
          src={product.productImage}
          alt={product.productName}
          width={500}
          height={500}
          className="rounded-lg"
        />
      </div>

      {/* Details */}
      <div>
        <h1 className="text-3xl font-bold mb-4">
          {product.productName}
        </h1>

        <p className="text-gray-600 mb-4">
          {product.description || "No description available"}
        </p>

        <div className="flex items-center gap-4 mb-6">
          <span className="text-2xl font-semibold text-green-600">
            ₹{product.sellingPrice}
          </span>
          <span className="line-through text-gray-400">
            ₹{product.price}
          </span>
        </div>
      </div>
    </div>
  );
}

