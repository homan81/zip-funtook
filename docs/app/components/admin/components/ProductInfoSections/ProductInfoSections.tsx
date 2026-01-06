'use client';

import React from "react";
import { UseFormRegister } from "react-hook-form";
import { MinusCircle, PlusCircle } from "lucide-react";

interface FieldItem {
  id: string;
}

interface FaqItem {
  id: string;
}

interface Props {
  register: UseFormRegister<any>;

  fieldsPackage: FieldItem[];
  fieldsDelivery: FieldItem[];
  fieldsCare: FieldItem[];
  faqFields: FaqItem[];

  appendPackage: (value: string) => void;
  appendDelivery: (value: string) => void;
  appendCare: (value: string) => void;
  appendFaq: (value: { question: string; answer: string }) => void;

  removePackage: (index: number) => void;
  removeDelivery: (index: number) => void;
  removeCare: (index: number) => void;
  removeFaq: (index: number) => void;

  showPackage: boolean;
  showDelivery: boolean;
  showCare: boolean;
  showFaqs: boolean;

  togglePackage: () => void;
  toggleDelivery: () => void;
  toggleCare: () => void;
  toggleFaqs: () => void;
}

const ProductInfoSections: React.FC<Props> = ({
  register,

  fieldsPackage,
  fieldsDelivery,
  fieldsCare,
  faqFields,

  appendPackage,
  appendDelivery,
  appendCare,
  appendFaq,

  removePackage,
  removeDelivery,
  removeCare,
  removeFaq,

  showPackage,
  showDelivery,
  showCare,
  showFaqs,

  togglePackage,
  toggleDelivery,
  toggleCare,
  toggleFaqs,
}) => {
  return (
    <>

      {/* ---------------------- PACKAGE INCLUSION ---------------------- */}
      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 mb-6">
        <div className="flex items-center justify-between">
          <label className="flex gap-2 items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showPackage}
              onChange={togglePackage}
              className="h-4 w-4 text-[#FC6E88]"
            />
            <span className="text-sm font-semibold text-gray-800">
              Package Inclusion
            </span>
          </label>

          {showPackage && (
            <button
              type="button"
              onClick={() => appendPackage("")}
              className="text-xs flex items-center gap-1 text-[#FC6E88]"
            >
              <PlusCircle className="w-4 h-4" /> Add
            </button>
          )}
        </div>

        {showPackage && (
          <div className="mt-3 space-y-2">
            {fieldsPackage.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-2">
                <input
                  {...register(`packageInclusion.${idx}`)}
                  placeholder="Enter package inclusion"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
                {fieldsPackage.length > 1 && (
                  <button type="button" onClick={() => removePackage(idx)}>
                    <MinusCircle className="w-5 h-5 text-red-500" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------------------- DELIVERY DETAILS ---------------------- */}
      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 mb-6">
        <div className="flex items-center justify-between">
          <label className="flex gap-2 items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showDelivery}
              onChange={toggleDelivery}
              className="h-4 w-4 text-[#FC6E88]"
            />
            <span className="text-sm font-semibold text-gray-800">
              Delivery Details
            </span>
          </label>

          {showDelivery && (
            <button
              type="button"
              onClick={() => appendDelivery("")}
              className="text-xs flex items-center gap-1 text-[#FC6E88]"
            >
              <PlusCircle className="w-4 h-4" /> Add
            </button>
          )}
        </div>

        {showDelivery && (
          <div className="mt-3 space-y-2">
            {fieldsDelivery.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-2">
                <input
                  {...register(`deliveryDetails.${idx}`)}
                  placeholder="Enter delivery detail"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
                {fieldsDelivery.length > 1 && (
                  <button type="button" onClick={() => removeDelivery(idx)}>
                    <MinusCircle className="w-5 h-5 text-red-500" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------------------- CARE INFO ---------------------- */}
      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 mb-6">
        <div className="flex items-center justify-between">
          <label className="flex gap-2 items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showCare}
              onChange={toggleCare}
              className="h-4 w-4 text-[#FC6E88]"
            />
            <span className="text-sm font-semibold text-gray-800">
              Care Info
            </span>
          </label>

          {showCare && (
            <button
              type="button"
              onClick={() => appendCare("")}
              className="text-xs flex items-center gap-1 text-[#FC6E88]"
            >
              <PlusCircle className="w-4 h-4" /> Add
            </button>
          )}
        </div>

        {showCare && (
          <div className="mt-3 space-y-2">
            {fieldsCare.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-2">
                <input
                  {...register(`careInfo.${idx}`)}
                  placeholder="Enter care instruction"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
                {fieldsCare.length > 1 && (
                  <button type="button" onClick={() => removeCare(idx)}>
                    <MinusCircle className="w-5 h-5 text-red-500" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------------------- FAQ SECTION ---------------------- */}
      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 mb-6">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showFaqs}
              onChange={toggleFaqs}
              className="h-4 w-4 text-[#FC6E88]"
            />
            <span className="text-sm font-semibold text-gray-800">
              FAQs
            </span>
          </label>

          {showFaqs && (
            <button
              type="button"
              onClick={() =>
                appendFaq({ question: "", answer: "" })
              }
              className="inline-flex items-center gap-1 text-xs text-[#FC6E88]"
            >
              <PlusCircle className="w-4 h-4" /> Add FAQ
            </button>
          )}
        </div>

        {showFaqs && (
          <div className="mt-3 space-y-3">
            {faqFields.map((faq, idx) => (
              <div key={faq.id} className="bg-white rounded-lg p-3 space-y-2">
                <input
                  {...register(`faqs.${idx}.question`)}
                  placeholder="Question"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />

                <div className="flex items-center gap-2">
                  <input
                    {...register(`faqs.${idx}.answer`)}
                    placeholder="Answer"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />

                  {faqFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFaq(idx)}
                      className="text-red-500"
                    >
                      <MinusCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductInfoSections;
