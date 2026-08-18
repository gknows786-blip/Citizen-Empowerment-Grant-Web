import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/eligibility")({
  head: () => ({
    meta: [
      { title: "Eligibility Criteria — U.S. Federal Citizen Grant Program" },
      {
        name: "description",
        content: "Check if you qualify for the federal citizen grant program. Simple eligibility requirements.",
      },
    ],
  }),
  component: Eligibility,
});

function Eligibility() {
  const eligibilityRequirements = [
    {
      icon: "✅",
      title: "Age Requirement",
      description: "You must be 18 years or older",
    },
    {
      icon: "✅",
      title: "Residency",
      description: "Be a resident of any American country (USA, Canada, Latin America, or Caribbean)",
    },
    {
      icon: "✅",
      title: "Valid ID",
      description: "Must have a valid government-issued ID or passport",
    },
    {
      icon: "✅",
      title: "Active Email",
      description: "Need a valid email address for communication and verification",
    },
    {
      icon: "✅",
      title: "Bank Account",
      description: "Must have a bank account in your name for secure fund transfer",
    },
    {
      icon: "✅",
      title: "Citizenship Status",
      description: "Citizens or permanent residents of supported countries eligible",
    },
  ];

  const exclusions = [
    "Currently employed by federal government",
    "Previous grant recipients in last 12 months",
    "Those with active legal disputes with government",
    "Individuals with pending fraud investigations",
    "Age under 18 years",
  ];

  const grantPackages = [
    { name: "Basic", amount: "$10,000", fee: "$100", processing: "24 hours" },
    { name: "Silver", amount: "$20,000", fee: "$200", processing: "24 hours" },
    { name: "Gold", amount: "$50,000", fee: "$500", processing: "24-48 hours" },
    { name: "Platinum", amount: "$100,000", fee: "$1,000", processing: "24-48 hours" },
    { name: "Diamond", amount: "$200,000", fee: "$2,000", processing: "48 hours" },
  ];

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
        <div className="px-4 py-12">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-blue-900 font-serif mb-4">
                Eligibility Criteria & Requirements
              </h1>
              <p className="text-gray-700 text-lg">
                Learn who qualifies for the U.S. Federal Citizen Grant Program
              </p>
            </div>

            {/* Quick Eligibility Check */}
            <Card className="p-8 bg-green-50 border-2 border-green-300 shadow-lg mb-8">
              <div className="flex gap-4 items-start mb-4">
                <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                <div>
                  <h2 className="text-2xl font-bold text-green-900 mb-3 font-serif">Quick Eligibility Check</h2>
                  <p className="text-green-800 mb-4">
                    If you meet ALL of the following criteria, you likely qualify for our grant program:
                  </p>
                </div>
              </div>
            </Card>

            {/* Main Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {eligibilityRequirements.map((req, idx) => (
                <Card key={idx} className="p-6 bg-white shadow-md hover:shadow-lg transition">
                  <div className="text-3xl mb-3">{req.icon}</div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">{req.title}</h3>
                  <p className="text-gray-700">{req.description}</p>
                </Card>
              ))}
            </div>

            {/* Important Notice */}
            <Card className="p-6 bg-red-50 border-l-4 border-red-600 mb-12">
              <div className="flex gap-4">
                <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-red-900 text-lg mb-2">Exclusions & Restrictions</h3>
                  <p className="text-red-800 mb-3">You are NOT eligible if you:</p>
                  <ul className="text-red-800 space-y-1">
                    {exclusions.map((exclusion, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span>•</span>
                        <span>{exclusion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* Grant Packages Overview */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-blue-900 font-serif mb-6">Available Grant Packages</h2>
              <div className="overflow-x-auto">
                <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
                  <thead className="bg-blue-900 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Package</th>
                      <th className="px-6 py-4 text-left font-semibold">Grant Amount</th>
                      <th className="px-6 py-4 text-left font-semibold">Processing Fee</th>
                      <th className="px-6 py-4 text-left font-semibold">Processing Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grantPackages.map((pkg, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                        <td className="px-6 py-4 font-semibold text-blue-900">{pkg.name}</td>
                        <td className="px-6 py-4 text-green-600 font-bold">{pkg.amount}</td>
                        <td className="px-6 py-4 text-orange-600 font-semibold">${pkg.fee}</td>
                        <td className="px-6 py-4 text-gray-700">{pkg.processing}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Process Steps */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-blue-900 font-serif mb-6">Application Process</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { step: 1, title: "Check Eligibility", desc: "Verify you meet all requirements" },
                  { step: 2, title: "Submit Form", desc: "Complete online application" },
                  { step: 3, title: "Verify Identity", desc: "Government ID verification" },
                  { step: 4, title: "Receive Grant", desc: "Funds via UPS/FedEx" },
                ].map((item) => (
                  <Card key={item.step} className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                    <div className="text-4xl font-bold mb-3">{item.step}</div>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-blue-100">{item.desc}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <Card className="p-8 bg-white shadow-lg mb-12">
              <h2 className="text-3xl font-bold text-blue-900 font-serif mb-6">Frequently Asked Questions</h2>

              <div className="space-y-6">
                <div className="border-b pb-6">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">Q: How much can I receive?</h3>
                  <p className="text-gray-700">
                    A: You can receive between $10,000 and $200,000 depending on the package you select. All amounts are approved by Congress.
                  </p>
                </div>

                <div className="border-b pb-6">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">Q: Do I need to repay the grant?</h3>
                  <p className="text-gray-700">
                    A: No, this is a grant, not a loan. You do not need to repay the money. It is free money from the federal government.
                  </p>
                </div>

                <div className="border-b pb-6">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">Q: How long does processing take?</h3>
                  <p className="text-gray-700">
                    A: Processing typically takes 24-48 hours depending on your selected package. Once verified, funds are delivered via secure UPS/FedEx.
                  </p>
                </div>

                <div className="border-b pb-6">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">Q: What is the processing fee for?</h3>
                  <p className="text-gray-700">
                    A: The fee covers tax clearance, legal processing, and insured home delivery. These are mandatory federal processing costs.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-blue-900 mb-2">Q: How do I apply?</h3>
                  <p className="text-gray-700">
                    A: Simply click "Check Your Eligibility" on the homepage, fill out the application form with your information, and submit. You will receive a reference number for tracking.
                  </p>
                </div>
              </div>
            </Card>

            {/* CTA Button */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">Ready to Apply?</h2>
              <Link to="/apply">
                <Button className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 text-lg">
                  START YOUR APPLICATION NOW
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

const excluded = [
  "Requests to cover personal expenses or personal debt.",
  "Political campaigning or partisan activity.",
  "Projects that have already been fully funded elsewhere.",
  "Applications missing a budget breakdown.",
];

const rubric = [
  { label: "Community need", weight: "30%" },
  { label: "Feasibility of the plan", weight: "25%" },
  { label: "Budget clarity and value", weight: "25%" },
  { label: "Sustainability after the grant", weight: "20%" },
];

function Eligibility() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-14">
        <h1 className="text-3xl font-bold text-foreground">Eligibility and scoring</h1>
        <p className="mt-3 text-muted-foreground">
          Everything below is published in advance so applicants can decide for themselves whether
          applying is worth their time. There is no application fee and no fee at any later stage.
        </p>

        <h2 className="mt-10 text-xl font-bold text-foreground">Who can apply</h2>
        <ul className="mt-3 space-y-2">
          {criteria.map((c) => (
            <li
              key={c}
              className="rounded-sm border border-border bg-card p-3 text-sm text-foreground"
            >
              {c}
            </li>
          ))}
        </ul>

        <h2 className="mt-10 text-xl font-bold text-foreground">What we do not fund</h2>
        <ul className="mt-3 space-y-2">
          {excluded.map((c) => (
            <li
              key={c}
              className="rounded-sm border border-border bg-secondary p-3 text-sm text-foreground"
            >
              {c}
            </li>
          ))}
        </ul>

        <h2 className="mt-10 text-xl font-bold text-foreground">How applications are scored</h2>
        <table className="mt-3 w-full border border-border bg-card text-sm">
          <thead>
            <tr className="bg-secondary text-left">
              <th className="border-b border-border p-3 font-semibold">Criterion</th>
              <th className="border-b border-border p-3 font-semibold">Weight</th>
            </tr>
          </thead>
          <tbody>
            {rubric.map((r) => (
              <tr key={r.label}>
                <td className="border-b border-border p-3">{r.label}</td>
                <td className="border-b border-border p-3">{r.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Link
          to="/apply"
          className="mt-10 inline-block rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Start an application
        </Link>
      </div>
    </SiteLayout>
  );
}
