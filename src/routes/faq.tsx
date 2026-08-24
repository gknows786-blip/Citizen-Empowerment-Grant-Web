import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { SiteLayout } from "@/components/SiteLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, HelpCircle, ShieldCheck, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      {
        title: "Frequently Asked Questions — U.S. Federal Grant Program",
      },
      {
        name: "description",
        content: "Frequently asked questions about federal citizen grant applications, verification, and disbursement.",
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
      "This program is an official economic empowerment initiative designed to disburse approved federal grant allocations directly to eligible citizens and permanent residents.",
  },
  {
    category: "General",
    question: "Is this a loan that needs to be repaid?",
    answer:
      "No. These are non-repayable federal grants approved under economic empowerment provisions. No collateral or repayment is ever required.",
  },
  {
    category: "General",
    question: "How do I receive my grant allocation?",
    answer:
      "Once you select your package tier and complete delivery clearance, funds are securely packed and dispatched via insured courier (UPS/FedEx) directly to your registered residential address.",
  },
  {
    category: "Eligibility",
    question: "Who is qualified to apply?",
    answer:
      "Applicants must be at least 18 years of age and hold valid identification. All qualified residents across eligible states can apply.",
  },
  {
    category: "Eligibility",
    question: "Where can I find the criteria?",
    answer:
      "Visit the Eligibility page on our portal to review complete requirements and allocation scoring criteria.",
  },
  {
    category: "Application",
    question: "How long does the application take?",
    answer:
      "The online registration process takes under 3 minutes. Your unique application reference number is generated instantly upon submission.",
  },
  {
    category: "Application",
    question: "Can I track my grant delivery status?",
    answer:
      "Yes. Simply log into your dashboard using your email and password to view real-time clearance and dispatch updates.",
  },
  {
    category: "Delivery & Clearance",
    question: "Why is a processing clearance fee required?",
    answer:
      "The clearance fee covers mandatory federal legal clearance, tax withholding certification, and fully insured armored courier transit via UPS/FedEx.",
  },
  {
    category: "Security",
    question: "How is my personal information protected?",
    answer:
      "All application data is encrypted using 256-bit SSL protocols in strict compliance with federal privacy and data security standards.",
  },
  {
    category: "Security",
    question: "Should I share my reference number with anyone?",
    answer:
      "No. Keep your application reference number and account credentials strictly confidential for security and verification protection.",
  },
];

function FAQ() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(faqItems.map((item) => item.category)))];

  const filteredFAQs =
    selectedCategory === "All"
      ? faqItems
      : faqItems.filter((item) => item.category === selectedCategory);

  return (
    <SiteLayout>
      <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex p-3 rounded-full bg-blue-100 text-blue-900 mb-3 shadow">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-blue-950">
              Frequently Asked Questions
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Everything you need to know about the Federal Citizen Grant &amp; Empowerment Portal.
            </p>
          </div>

          {/* Categories Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className={
                  selectedCategory === category
                    ? "bg-blue-900 text-white font-bold"
                    : "border-slate-300 text-slate-700 hover:bg-slate-200"
                }
              >
                {category}
              </Button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <Card className="overflow-hidden shadow-md border border-slate-200 bg-white">
            {filteredFAQs.map((item, index) => {
              const isExpanded = expandedId === index;

              return (
                <div
                  key={`${item.category}-${item.question}`}
                  className={index !== filteredFAQs.length - 1 ? "border-b border-slate-200" : ""}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 sm:px-6 py-4 text-left transition hover:bg-slate-50"
                  >
                    <div className="flex flex-1 items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-900 shrink-0" />
                      <span className="text-sm sm:text-base font-semibold text-blue-950">
                        {item.question}
                      </span>
                    </div>

                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-slate-400 transition-transform ${
                        isExpanded ? "rotate-180 text-blue-900" : ""
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50/70 px-5 sm:px-6 py-4">
                      <p className="leading-relaxed text-xs sm:text-sm text-slate-700">
                        {item.answer}
                      </p>

                      {item.category === "Eligibility" && (
                        <div className="mt-3">
                          <Link to="/eligibility">
                            <Button variant="outline" size="sm" className="text-xs">
                              Review Eligibility Criteria
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </Card>

          {/* Need Help Card */}
          <Card className="bg-gradient-to-r from-blue-950 to-blue-900 p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif mb-1">
                Ready to Submit Your Application?
              </h2>
              <p className="text-xs sm:text-sm text-blue-200">
                It takes only 3 minutes to register and receive your official reference code.
              </p>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <Link to="/apply" search={{ tab: "signup" }} className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-blue-950 font-bold gap-2">
                  <span>Apply Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </SiteLayout>
  );
}

