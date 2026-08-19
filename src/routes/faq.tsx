import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { SiteLayout } from "@/components/SiteLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      {
        title: "FAQ — Grant Portal Demo",
      },
      {
        name: "description",
        content: "Frequently asked questions about the independent grant portal demonstration.",
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
    question: "What is this grant portal?",
    answer:
      "This is an independent software demonstration showing how a grant application portal could work. It is not an official government website.",
  },
  {
    category: "General",
    question: "Is this an official government website?",
    answer:
      "No. This project is an independent demonstration and is not affiliated with or operated by the U.S. government.",
  },
  {
    category: "General",
    question: "Does submitting an application guarantee funding?",
    answer: "No. Submitting an application does not guarantee funding or approval.",
  },
  {
    category: "Eligibility",
    question: "Who can apply?",
    answer:
      "The demonstration accepts applications from adults who meet the requirements displayed on the eligibility page.",
  },
  {
    category: "Eligibility",
    question: "Where can I see the requirements?",
    answer:
      "Visit the Eligibility page to review the application's requirements and scoring criteria.",
  },
  {
    category: "Application",
    question: "How long does the application take?",
    answer:
      "The demonstration application is designed to be completed in a few minutes, depending on how much information you provide.",
  },
  {
    category: "Application",
    question: "Can I edit my application?",
    answer:
      "That depends on how the backend is configured. In this demonstration, application editing can be implemented as part of the application's account dashboard.",
  },
  {
    category: "Application",
    question: "What information should I provide?",
    answer:
      "Only provide information that the application actually needs. Do not submit passwords, payment credentials, or unnecessary government identification numbers.",
  },
  {
    category: "Fees",
    question: "Is there an application fee?",
    answer: "No application fee is required by this demonstration project.",
  },
  {
    category: "Fees",
    question: "Will someone ask me to pay money to receive funding?",
    answer:
      "This demonstration does not require payment to submit an application. Be cautious of anyone requesting money, passwords, or sensitive information in exchange for a promised grant.",
  },
  {
    category: "Security",
    question: "Is my information safe?",
    answer:
      "Only submit information through systems you trust. The security of a real deployment depends on the backend, database, authentication, encryption, hosting configuration, and other security controls.",
  },
  {
    category: "Security",
    question: "Should I share my password with support?",
    answer:
      "No. Never share your password, authentication codes, or other account secrets with anyone claiming to provide support.",
  },
  {
    category: "Support",
    question: "How can I get help with the demonstration?",
    answer:
      "Use the support method provided by the owner or developer of the project. Do not rely on unofficial phone numbers or email addresses claiming to represent a government agency.",
  },
  {
    category: "Legal",
    question: "Is this a government program?",
    answer: "No. This is an independent demonstration project.",
  },
  {
    category: "Legal",
    question: "Can this project guarantee that I will receive a grant?",
    answer:
      "No. The software can demonstrate an application workflow, but it cannot guarantee funding from any government or other organization.",
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
        <div className="px-4 py-12">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h1 className="mb-4 font-serif text-4xl font-bold text-blue-900">
                Frequently Asked Questions
              </h1>

              <p className="text-lg text-gray-700">
                Answers about this independent grant portal demonstration.
              </p>
            </div>

            <Card className="mb-8 border-2 border-yellow-300 bg-yellow-50 p-6">
              <h2 className="mb-2 text-xl font-bold text-yellow-900">Important</h2>

              <p className="text-yellow-800">
                This project is an independent demonstration. It is not an official U.S. government
                website and does not guarantee funding.
              </p>
            </Card>

            <div className="mb-8 flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={
                    selectedCategory === category
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>

            <Card className="overflow-hidden shadow-lg">
              {filteredFAQs.map((item, index) => {
                const isExpanded = expandedId === index;

                return (
                  <div
                    key={`${item.category}-${item.question}`}
                    className={index !== filteredFAQs.length - 1 ? "border-b" : ""}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : index)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-blue-50"
                    >
                      <div className="flex flex-1 items-center gap-4">
                        <span className="text-2xl">❓</span>

                        <span className="text-lg font-semibold text-blue-900">{item.question}</span>
                      </div>

                      <ChevronDown
                        size={24}
                        className={`flex-shrink-0 text-blue-600 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="border-t bg-blue-50 px-6 pb-5 pt-4">
                        <p className="leading-relaxed text-gray-700">{item.answer}</p>

                        {item.category === "Eligibility" && (
                          <div className="mt-4">
                            <Link to="/eligibility">
                              <Button variant="outline" size="sm">
                                View Eligibility
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

            <Card className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
              <h2 className="mb-4 text-2xl font-bold">Need More Information?</h2>

              <p className="mb-6 text-blue-100">
                Review the eligibility requirements or start an application to explore the
                demonstration.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to="/eligibility">
                  <Button className="bg-white text-blue-700 hover:bg-blue-50">
                    View Eligibility
                  </Button>
                </Link>

                <Link to="/apply">
                  <Button className="bg-green-600 text-white hover:bg-green-700">
                    Start Application
                  </Button>
                </Link>
              </div>
            </Card>

            <div className="mt-12 text-center">
              <p className="text-sm text-gray-500">Independent grant portal demonstration</p>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
