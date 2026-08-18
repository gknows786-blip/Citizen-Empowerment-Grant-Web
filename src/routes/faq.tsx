import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — U.S. Federal Citizen Grant Program" },
      {
        name: "description",
        content: "Frequently asked questions about the U.S. Federal Citizen Grant Program. Get answers to common questions.",
      },
    ],
  }),
  component: FAQ,
});

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqItems: FAQItem[] = [
  {
    category: "General",
    question: "What is the U.S. Federal Citizen Grant Program?",
    answer:
      "The U.S. Federal Citizen Grant Program is an official federal initiative to distribute granted funds to eligible citizens. It is authorized by Congress and administered through this secure online portal.",
  },
  {
    category: "General",
    question: "Is this program legitimate?",
    answer:
      "Yes, this is an official U.S. federal program. Our portal is registered with the Federal Grant Administration Bureau and all transactions are secure and government-verified.",
  },
  {
    category: "Eligibility",
    question: "Who is eligible for this grant?",
    answer:
      "Any person 18 years or older with a valid government ID, from any country in the Americas, can apply. You must have a valid email address and bank account for fund transfer.",
  },
  {
    category: "Eligibility",
    question: "Can I apply if I have bad credit?",
    answer:
      "Yes! Credit history does not affect grant eligibility. Grants are gifts, not loans. Your credit rating is not reviewed as part of the application process.",
  },
  {
    category: "Eligibility",
    question: "Are students eligible?",
    answer:
      "Yes, students aged 18 and older are eligible to apply. You can use the grant for education, personal expenses, or any other purpose.",
  },
  {
    category: "Application",
    question: "How long does the application process take?",
    answer:
      "The online application takes approximately 15 minutes to complete. Once submitted, verification takes 24-48 hours before your grant is approved and processed for delivery.",
  },
  {
    category: "Application",
    question: "What information do I need to provide?",
    answer:
      "You will need to provide: full name, email address, phone number, date of birth, address, occupation, marital status, and a government-issued ID number. All information is encrypted and protected.",
  },
  {
    category: "Application",
    question: "Can I edit my application after submission?",
    answer:
      "Contact our support team within 24 hours of submission to request changes. After verification begins, changes cannot be made.",
  },
  {
    category: "Grants",
    question: "How much can I receive?",
    answer:
      "You can receive between $10,000 and $200,000 depending on the package you select. All amounts have been approved by Congress.",
  },
  {
    category: "Grants",
    question: "Do I have to pay taxes on the grant?",
    answer:
      "Grant amounts are typically not subject to federal income tax as they are considered gift transfers. However, consult with a tax professional for your specific situation.",
  },
  {
    category: "Grants",
    question: "Is there a limit to how many times I can apply?",
    answer:
      "Each person can receive one grant per year. Previous grant recipients must wait 12 months before applying again.",
  },
  {
    category: "Fees",
    question: "Are there any fees to apply?",
    answer:
      "Application is completely free. However, once you select a grant package, there is a mandatory processing fee that covers tax clearance, legal processing, and insured delivery.",
  },
  {
    category: "Fees",
    question: "Why do I have to pay a processing fee?",
    answer:
      "The processing fee covers: federal tax clearance verification, legal document preparation, application processing, and insured home delivery via UPS/FedEx. These are required government fees.",
  },
  {
    category: "Fees",
    question: "Can the processing fee be deducted from my grant?",
    answer:
      "No, the processing fee is separate and must be paid upfront. Your full grant amount is paid in addition to the fee you submit.",
  },
  {
    category: "Payment",
    question: "How do I make the payment?",
    answer:
      "After applying and selecting your grant package, we provide you with bank transfer details. You transfer the processing fee to our secure bank account, and your grant is processed immediately.",
  },
  {
    category: "Payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept wire transfers and bank transfers to our verified federal account. All transactions are secure and monitored by federal authorities.",
  },
  {
    category: "Payment",
    question: "Is my payment information secure?",
    answer:
      "Yes, all payment information is encrypted with military-grade security. Our payment portal is PCI DSS compliant and monitored 24/7.",
  },
  {
    category: "Delivery",
    question: "How will I receive my grant money?",
    answer:
      "Your grant is delivered via insured UPS or FedEx shipment to your home address. A representative will require a signature and ID verification upon delivery.",
  },
  {
    category: "Delivery",
    question: "How long does delivery take?",
    answer:
      "Most grants are delivered within 24-48 hours of payment confirmation. Tracking information is provided via email so you can monitor your package.",
  },
  {
    category: "Delivery",
    question: "What if I am not home for delivery?",
    answer:
      "The carrier will leave a notice. You can arrange a redelivery time that works for you. Delivery attempts are made up to 3 times before returning the grant.",
  },
  {
    category: "Support",
    question: "What if I have problems with my application?",
    answer:
      "Contact our support team at support@usfederalgrant.gov or call (202) 555-0199. We are available Monday-Friday, 9 AM - 5 PM EST.",
  },
  {
    category: "Support",
    question: "Can I speak to a live representative?",
    answer:
      "Yes, our customer support team is available by phone at (202) 555-0199 during business hours. You can also email us and expect a response within 24 hours.",
  },
  {
    category: "Support",
    question: "How can I check the status of my application?",
    answer:
      "Use your reference number in the status check section of our portal. You will see real-time updates on your application, verification, and delivery status.",
  },
  {
    category: "Legal",
    question: "Is this a loan?",
    answer:
      "No, this is a grant, not a loan. You do not have to repay any of the funds. It is free money from the federal government.",
  },
  {
    category: "Legal",
    question: "What happens if I share my reference number?",
    answer:
      "Your reference number is confidential. Sharing it with others is a violation of the terms and conditions and may result in cancellation of your grant.",
  },
  {
    category: "Legal",
    question: "Can I be scammed using this program?",
    answer:
      "No, this is an official government program. Never pay anyone else claiming to "help" you get the grant - this is a common scam. Always apply only through this official portal.",
  },
];

function FAQ() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(faqItems.map((item) => item.category)))];
  const filteredFAQs = selectedCategory === "All" ? faqItems : faqItems.filter((item) => item.category === selectedCategory);

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
        <div className="px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-blue-900 font-serif mb-4">Frequently Asked Questions</h1>
              <p className="text-gray-700 text-lg">
                Find answers to common questions about the U.S. Federal Citizen Grant Program
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={
                    selectedCategory === category
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* FAQ Accordion */}
            <Card className="shadow-lg">
              {filteredFAQs.map((item, idx) => (
                <div key={idx} className={idx !== filteredFAQs.length - 1 ? "border-b" : ""}>
                  <button
                    onClick={() => setExpandedId(expandedId === idx ? null : idx)}
                    className="w-full px-6 py-4 text-left hover:bg-blue-50 transition flex justify-between items-center group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-2xl text-blue-600 group-hover:scale-110 transition">❓</div>
                      <span className="text-lg font-semibold text-blue-900">{item.question}</span>
                    </div>
                    <ChevronDown
                      size={24}
                      className={`text-blue-600 transition-transform ${expandedId === idx ? "rotate-180" : ""}`}
                    />
                  </button>

                  {expandedId === idx && (
                    <div className="px-6 pb-4 bg-blue-50 border-t">
                      <div className="text-gray-700 leading-relaxed">{item.answer}</div>
                      {item.category === "General" && (
                        <div className="mt-4 pt-4 border-t border-blue-200">
                          <Link to="/eligibility">
                            <Button variant="outline" size="sm">
                              Learn More About Eligibility
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </Card>

            {/* Contact Section */}
            <Card className="mt-12 p-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
              <p className="mb-6">Our support team is here to help. Contact us through any of these channels:</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="font-semibold mb-2">📞 Phone</p>
                  <p className="text-blue-100">(202) 555-0199</p>
                  <p className="text-sm text-blue-200">Mon-Fri, 9 AM - 5 PM EST</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">📧 Email</p>
                  <p className="text-blue-100">support@usfederalgrant.gov</p>
                  <p className="text-sm text-blue-200">Response within 24 hours</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">📍 Office</p>
                  <p className="text-blue-100">100 Independence Ave</p>
                  <p className="text-sm text-blue-200">Washington, DC 20500</p>
                </div>
              </div>
            </Card>

            {/* CTA */}
            <div className="text-center mt-12">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Ready to Start?</h3>
              <Link to="/apply">
                <Button className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 text-lg">
                  BEGIN YOUR APPLICATION
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
