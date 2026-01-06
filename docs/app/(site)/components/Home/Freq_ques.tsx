import React from 'react'
import Faqs from '../faqs/Faqs'

export default function Freq_ques() {
    return (
        <div>
            <div className="container mx-auto p-4">
                <div className="text-center">
                    <h4 className="font-bold text-[28px] mt-8">
                        Frequently Asked Questions
                    </h4>
                    <p>
                        Find quick answers to common questions about balloon decorations
                    </p>
                    <Faqs />
                </div>
            </div>
        </div>
    )
}
