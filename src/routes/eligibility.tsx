import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export const Route = createFileRoute("/eligibility")({
  head: () => ({
    meta: [
      {
        title: "Eligibility & Scoring — Grant Portal Demo",
      },
      {
        name: "description",
        content:
          "Eligibility requirements and application scoring for an independent grant portal demonstration.",
      },
    ],
  }),
  component: Eligibility,
});

const criteria = [
  "Applicants must be at least 18 years old.",
  "Applicants must provide a valid email address.",
  "Applicants should provide accurate contact information.",
  "Applications should include a clear description of the proposed project.",
  "Applications should include a realistic budget.",
];

const excluded = [
  "Requests to cover personal debt.",
  "Political campaigning or partisan activity.",
  "Projects that have already been fully funded elsewhere.",
  "Applications missing important project information.",
];

const rubric = [
  {
    label: "Community need",
    weight: "30%",
  },
  {
    label: "Feasibility of the plan",
    weight: "25%",
  },
  {
    label: "Budget clarity and value",
    weight: "25%",
  },
  {
    label: "Sustainability after the grant",
    weight: "20%",
  },
];

const applicationSteps = [
  {
    step: 1,
    title: "Check eligibility",
    description:
      "Review the requirements before starting.",
  },
  {
    step: 2,
    title: "Create an account",
    description:
      "Provide basic contact information.",
  },
  {
    step: 3,
    title: "Submit your project",
    description:
      "Describe your project and provide a budget.",
  },
  {
    step: 4,
    title: "Application review",
    description:
      "Applications can be reviewed using the published criteria.",
  },
];

function Eligibility() {
  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
        <div className="px-4 py-12">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h1 className="mb-4 font-serif text-4xl font-bold text-blue-900">
                Eligibility & Scoring
              </h1>

              <p className="text-lg text-gray-700">
                Review the requirements before starting an
                application.
              </p>
            </div>

            <Card className="mb-10 border-2 border-yellow-300 bg-yellow-50 p-6">
              <div className="flex items-start gap-4">
                <AlertCircle
                  className="flex-shrink-0 text-yellow-600"
                  size={24}
                />

                <div>
                  <h2 className="mb-2 text-xl font-bold text-yellow-900">
                    Demonstration Project
                  </h2>

                  <p className="text-yellow-800">
                    This portal is an independent software
                    demonstration. It is not an official government
                    website and does not guarantee that an applicant
                    will receive funding.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="mb-10 bg-green-50 p-8">
              <div className="mb-6 flex items-start gap-4">
                <CheckCircle
                  className="flex-shrink-0 text-green-600"
                  size={28}
                />

                <div>
                  <h2 className="font-serif text-2xl font-bold text-green-900">
                    Who Can Apply
                  </h2>

                  <p className="mt-2 text-green-800">
                    The following requirements are used by this
                    demonstration application.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {criteria.map((criterion) => (
                  <div
                    key={criterion}
                    className="rounded-lg border border-green-200 bg-white p-4"
                  >
                    <div className="flex gap-3">
                      <span className="text-green-600">
                        ✓
                      </span>

                      <p className="text-gray-700">
                        {criterion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="mb-10 border-l-4 border-red-600 bg-red-50 p-6">
              <div className="flex gap-4">
                <AlertCircle
                  className="flex-shrink-0 text-red-600"
                  size={24}
                />

                <div>
                  <h2 className="mb-3 text-xl font-bold text-red-900">
                    Applications Not Supported
                  </h2>

                  <ul className="space-y-2 text-red-800">
                    {excluded.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2"
                      >
                        <span>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            <section className="mb-12">
              <h2 className="mb-6 font-serif text-3xl font-bold text-blue-900">
                How Applications Are Scored
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full overflow-hidden rounded-lg bg-white shadow-lg">
                  <thead className="bg-blue-900 text-white">
                    <tr>
                      <th className="p-4 text-left">
                        Criterion
                      </th>

                      <th className="p-4 text-left">
                        Weight
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {rubric.map((item, index) => (
                      <tr
                        key={item.label}
                        className={
                          index % 2 === 0
                            ? "bg-white"
                            : "bg-blue-50"
                        }
                      >
                        <td className="border-b p-4 font-semibold text-blue-900">
                          {item.label}
                        </td>

                        <td className="border-b p-4 text-gray-700">
                          {item.weight}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="mb-6 font-serif text-3xl font-bold text-blue-900">
                Application Process
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                {applicationSteps.map((item) => (
                  <Card
                    key={item.step}
                    className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white"
                  >
                    <div className="mb-3 text-4xl font-bold">
                      {item.step}
                    </div>

                    <h3 className="mb-2 text-lg font-bold">
                      {item.title}
                    </h3>

                    <p className="text-blue-100">
                      {item.description}
                    </p>
                  </Card>
                ))}
              </div>
            </section>

            <Card className="mb-10 bg-white p-8 shadow-lg">
              <h2 className="mb-6 font-serif text-3xl font-bold text-blue-900">
                Important Information
              </h2>

              <div className="space-y-4 text-gray-700">
                <p>
                  This application is part of an independent
                  demonstration project.
                </p>

                <p>
                  No application fee is required by this
                  demonstration portal.
                </p>

                <p>
                  Submission does not guarantee an award or
                  funding.
                </p>

                <p>
                  Never send passwords, payment information, or
                  unnecessary identity documents through an
                  unverified website.
                </p>
              </div>
            </Card>

            <div className="text-center">
              <h2 className="mb-6 text-2xl font-bold text-blue-900">
                Ready to Start?
              </h2>

              <Link to="/apply">
                <Button className="bg-green-600 px-8 py-4 text-lg font-bold text-white hover:bg-green-700">
                  START AN APPLICATION
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}