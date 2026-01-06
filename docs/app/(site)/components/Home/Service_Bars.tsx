import React from 'react'

export default function section_10() {
  return (
    <div>
      <div className="mt-16 container mx-auto p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <img
                src="/assets/sectionimages/truck.svg"
                className="w-10 h-10"
              />
              <div>
                <p className="font-bold text-[12px] lg:text-lg leading-tight">
                  Free Shipping
                </p>
                <p className="text-[10px] lg:text-sm text-gray-600 leading-snug">
                  Free Shipping for All Orders
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <img
                src="/assets/sectionimages/contract-rounded.svg"
                className="w-10 h-10"
              />
              <div>
                <p className="font-bold text-[12px] lg:text-lg leading-tight">
                  Money Guarantee
                </p>
                <p className="text-[10px] lg:text-sm text-gray-600 leading-snug">
                  Refund Within 30 Days
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <img
                src="/assets/sectionimages/support.svg"
                className="w-10 h-10"
              />
              <div>
                <p className="font-bold text-[12px] lg:text-lg leading-tight">
                  Online Support
                </p>
                <p className="text-[10px] lg:text-sm text-gray-600 leading-snug">
                  24/7 Available for You
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <img
                src="/assets/sectionimages/payemnt.svg"
                className="w-10 h-10"
              />
              <div>
                <p className="font-bold text-[12px] lg:text-lg leading-tight">
                  Flexible Payment
                </p>
                <p className="text-[10px] lg:text-sm text-gray-600 leading-snug">
                  Pay With Multiple Credit Cards
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
