"use client";
import { useState } from "react";

interface MicrolinkData {
  title: string;
  description: string;
  url: string;
}

export default function Faqs() {
  const [modalOpen, setModalOpen] = useState(false);
  const [sources, setSources] = useState<MicrolinkData[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  async function fetchMicrolinkData(url: string): Promise<MicrolinkData> {
    return {
      title: "Sample Title",
      description: "This is sample data fetched for: " + url,
      url,
    };
  }

  function openModal() {
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  async function handleSourceClick(urls: string[]) {
    setLoading(true);
    setSources([]);
    openModal();

    const results = await Promise.all(
      urls.map(async (url) => await fetchMicrolinkData(url))
    );

    setSources(results);
    setLoading(false);
  }

  return (
    <div className="mt-4 sm:mt-6 mx-auto px-3 sm:px-0">
      <Accordion
        title="What is the cheapest balloon decoration package in Patna?"
        isOpen={openAccordion === 0}
        onClick={() => setOpenAccordion(openAccordion === 0 ? null : 0)}
      >
        <div className="text-left text-sm sm:text-base">
          <p className="text-gray-700">
            At Funtook Our Basic Decoration Packages Starts with only 1299,
            which includes Balloons, Occasion Tags, Curtains and Ribbons.
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Contains Balloons & Birthdays Tags / Occasion Tag</li>
            <li>Frill Curtain Backdrop</li>
            <li>Ceilings and Floor Decors</li>
          </ul>
        </div>
      </Accordion>

      <Accordion
        title="How do I book balloon decorations for a birthday in Patna?"
        isOpen={openAccordion === 1}
        onClick={() => setOpenAccordion(openAccordion === 1 ? null : 1)}
      >
        <div className="text-left text-sm sm:text-base">
          <ul className="list-disc ml-5 text-gray-700 space-y-1">
            <li>How do I use this product?</li>
            <li>Does it come with warranty?</li>
            <li>Is it available in different colors?</li>
          </ul>
        </div>
      </Accordion>

      <Accordion
        title="Which areas in Patna do you serve?"
        isOpen={openAccordion === 2}
        onClick={() => setOpenAccordion(openAccordion === 2 ? null : 2)}
      >
        <div className="text-left text-sm sm:text-base">
          <p className="text-gray-700">
            Standard delivery takes 3–5 business days. Free shipping on orders
            above ₹999.
          </p>
        </div>
      </Accordion>

      <Accordion
        title="What’s included in your ₹4,999 premium package?"
        isOpen={openAccordion === 3}
        onClick={() => setOpenAccordion(openAccordion === 3 ? null : 3)}
      >
        <div className="text-left text-sm sm:text-base">
          <p className="text-gray-700">
            For more information, feel free to reach out to our support team.
          </p>
        </div>
      </Accordion>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-xs sm:max-w-sm relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-in">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-xl"
            >
              ×
            </button>

            <h2 className="text-lg font-semibold mb-3 text-center sm:text-left">
              Sources
            </h2>

            {loading ? (
              <p className="text-center">Loading…</p>
            ) : (
              <ul className="space-y-2">
                {sources.map((item, index) => (
                  <li
                    key={index}
                    className="border p-2 rounded text-sm sm:text-base"
                  >
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <a
                      href={item.url}
                      className="text-blue-600 text-sm underline break-all"
                    >
                      {item.url}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------
   Responsive Accordion Component
---------------------------------------------------- */

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

function Accordion({ title, children, isOpen, onClick }: AccordionProps) {
  return (
    <div className="p-3 sm:p-4 border-b border-[#DBDBDB]">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-base sm:text-lg font-medium"
      >
        <span className="text-[14px] text-left sm:text-[16px] lg:text-[18px] font-bold">
          {title}
        </span>
        <span className="text-xl sm:text-2xl">{isOpen ? "-" : "+"}</span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] mt-2" : "max-h-0 mt-0"
        }`}
      >
        <div
          className={`transition-opacity duration-300 text-sm sm:text-base ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
