import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ArrowRight,
  FileText,
  Award,
} from "lucide-react";

export const Route = createFileRoute("/eligibility")({
  head: () => ({
    meta: [
      {
        title: "Eligibility & Evaluation Criteria — U.S. Federal Grant Program",
      },
      {
        name: "description",
        content:
          "Official eligibility requirements and evaluation criteria for federal grant allocation.",
      },
    ],
  }),
  component: Eligibility,
});

const criteria = [
  "Applicants must be at least 18 years old.",
  "Must provide valid identity and residential contact details.",
  "Applicants must have an active phone number and email for verification.",
  "Grant allocation is available across all 50 states and participating regions.",
  "Direct home delivery verification requires accurate postal address.",
];

const excluded = [
  "Duplicate claims under the same personal identity.",
  "Providing falsified personal documentation or invalid age.",
  "Unverified third-party representatives.",
  "Failure to complete delivery payment clearance within processing window.",
];

const rubric = [
  {
    label: "Citizen Community Need & Impact",
    weight: "35%",
  },
  {
    label: "Identity & Residence Verification",
    weight: "25%",
  },
  {
    label: "Allocation Tier Suitability",
    weight: "20%",
  },
  {
    label: "Delivery Clearance Compliance",
    weight: "20%",
  },
];

const applicationSteps = [
  {
    step: 1,
    title: "Verify Eligibility",
    description: "Review simple statutory requirements online.",
  },
  {
    step: 2,
    title: "Register Claim",
    description: "Create an account and receive your unique reference number.",
  },
  {
    step: 3,
    title: "Select Grant Tier",
    description: "Choose an approved grant allocation from $10,000 to $200,000.",
  },
  {
    step: 4,
    title: "Disbursement & Delivery",
    description: "Complete clearance and receive funds via insured courier.",
  },
];

function Eligibility() {
  return (
    <SiteLayout>
      <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex p-3 rounded-full bg-blue-100 text-blue-900 mb-3 shadow">
              <Award className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-blue-950">
              Eligibility &amp; Evaluation Criteria
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Review the statutory qualifications and evaluation process for federal grant allocations.
            </p>
          </div>

          {/* Demonstration Notice */}
          <Card className="border border-amber-300 bg-amber-50/90 p-5 shadow-sm">
            <div className="flex items-start gap-3.5">
              <ShieldCheck className="shrink-0 text-amber-700 mt-0.5" size={22} />
              <div>
                <h2 className="text-sm font-bold text-amber-950 uppercase tracking-wide">
                  Official Verification Notice
                </h2>
                <p className="text-xs sm:text-sm text-amber-900 mt-0.5 leading-relaxed">
                  All claims are verified according to federal guidelines. Applications are processed on a first-come, first-served allocation basis.
                </p>
              </div>
            </div>
          </Card>

          {/* Criteria Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Who Can Apply */}
            <Card className="p-6 bg-white shadow-sm border border-slate-200">
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <h2 className="font-serif text-lg font-bold text-blue-950">
                  Who Is Qualified to Apply
                </h2>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                {criteria.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Ineligible Situations */}
            <Card className="p-6 bg-white shadow-sm border border-slate-200">
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-200">
                <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                <h2 className="font-serif text-lg font-bold text-blue-950">
                  Disqualifying Conditions
                </h2>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                {excluded.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Scoring Table */}
          <Card className="p-6 sm:p-8 bg-white shadow-sm border border-slate-200">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-blue-950 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-900" />
              <span>How Allocation Scoring Works</span>
            </h2>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-blue-950 text-white font-semibold">
                  <tr>
                    <th className="p-3.5 sm:p-4">Evaluation Criterion</th>
                    <th className="p-3.5 sm:p-4 text-right">Assessment Weight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {rubric.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="p-3.5 sm:p-4 font-semibold text-slate-800">{item.label}</td>
                      <td className="p-3.5 sm:p-4 font-bold text-blue-900 text-right">{item.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Application Steps */}
          <section className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-blue-950 text-center sm:text-left">
              4-Step Simple Disbursement Procedure
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {applicationSteps.map((item) => (
                <Card
                  key={item.step}
                  className="bg-gradient-to-br from-blue-950 to-blue-900 p-5 text-white shadow-md border-0"
                >
                  <div className="text-3xl font-extrabold text-amber-400 font-serif mb-2">
                    0{item.step}
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mb-1">{item.title}</h3>
                  <p className="text-xs text-blue-200 leading-relaxed">{item.description}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Ready to Start CTA */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 p-8 text-center text-white shadow-xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif">
              Begin Your Official Application
            </h2>
            <p className="text-xs sm:text-sm text-blue-200 max-w-xl mx-auto">
              Claim your approved grant reference code in less than 3 minutes.
            </p>
            <div>
              <Link to="/apply">
                <Button className="bg-amber-400 hover:bg-amber-500 text-blue-950 font-bold px-8 py-5 text-base shadow-lg gap-2">
                  <span>START APPLICATION</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
