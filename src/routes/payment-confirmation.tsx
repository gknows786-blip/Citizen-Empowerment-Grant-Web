import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getDashboardDataServerFn } from "@/lib/serverFunctions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle,
  ShieldCheck,
  ArrowLeft,
  Clock,
  User,
  Phone,
  ShieldAlert,
  Mail,
  FileCheck,
} from "lucide-react";

export const Route = createFileRoute("/payment-confirmation")({
  head: () => ({
    meta: [
      {
        title: "Grant Claim & Delivery Instructions",
      },
    ],
  }),
  component: PaymentConfirmation,
});

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  refNumber: string;
  selectedPackage: string | null;
  grantAmount: number | null;
}

function PaymentConfirmation() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate({ to: "/apply", search: { tab: "signup" } });
          return;
        }

        const result = await getDashboardDataServerFn({ data: { token } });
        if (result.success && result.data) {
          const data = result.data as any;

          if (!data.selectedPackage) {
            setError("Please select a grant package on your dashboard first.");
            setTimeout(() => navigate({ to: "/dashboard" }), 2000);
            return;
          }

          setUserData({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.profile.email,
            refNumber: data.refNumber,
            selectedPackage: data.selectedPackage,
            grantAmount: data.grantAmount,
          });
        } else {
          setError(result.error || "Failed to load claim details");
        }
      } catch (err) {
        setError("Failed to load your grant claim details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <SiteLayout>
        <div className="min-h-[70vh] bg-slate-100 flex items-center justify-center p-4">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <ShieldCheck className="w-10 h-10 text-blue-900 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-800">
              Loading your grant claim details...
            </p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!userData) {
    return (
      <SiteLayout>
        <div className="min-h-[70vh] bg-slate-100 p-6 flex items-center justify-center">
          <div className="max-w-md w-full">
            <Alert className="bg-red-50 border-red-300 text-red-900 shadow-md">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="font-medium">{error}</AlertDescription>
            </Alert>
            <div className="mt-4 text-center">
              <Link to="/dashboard">
                <Button className="bg-blue-900 text-white">Return to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-900 hover:text-blue-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Grant Dashboard</span>
            </Link>
          </div>

          <div className="bg-gradient-to-r from-blue-950 to-blue-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl text-center">
            <div className="inline-flex p-3 bg-blue-800/80 rounded-full text-amber-400 mb-3 ring-4 ring-blue-700/40">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif">
              Congratulations, {userData.firstName}!
            </h1>
            <p className="text-sm sm:text-base text-blue-100 mt-2">
              Your selected grant package has been recorded successfully.
            </p>
          </div>

          {error && (
            <Alert className="bg-red-50 border-red-300 text-red-900 shadow-sm">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="font-semibold">{error}</AlertDescription>
            </Alert>
          )}

          <Card className="p-6 sm:p-8 bg-white shadow-md border border-slate-200">
            <h2 className="text-lg font-bold font-serif text-blue-950 pb-3 mb-4 border-b border-slate-200 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-900" />
              <span>Grant Selection Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase">Selected Package</p>
                <p className="text-xl font-bold text-blue-950 mt-1">{userData.selectedPackage}</p>
              </div>
              <div className="border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0">
                <p className="text-[11px] font-bold text-slate-500 uppercase">Grant Amount</p>
                <p className="text-2xl font-extrabold text-emerald-700 mt-1">
                  ${userData.grantAmount?.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
              <p>
                Beneficiary:{" "}
                <strong className="text-slate-900">
                  {userData.firstName} {userData.lastName}
                </strong>
              </p>
              <p className="sm:text-right">
                Reference: <strong className="font-mono text-blue-900">{userData.refNumber}</strong>
              </p>
            </div>
          </Card>

          <Card className="p-6 sm:p-8 bg-white shadow-md border border-slate-200">
            <div className="flex items-start gap-3">
              <div className="shrink-0 rounded-full bg-blue-100 p-2 text-blue-900">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold font-serif text-blue-950">What To Do Next</h2>
                <p className="text-sm text-slate-600 mt-2 leading-6">
                  Your selection has been saved. To finalize your claim and coordinate the delivery
                  of your grant package, please contact your assigned program agent directly using
                  the details below.
                </p>

                {/* Assigned Agent Card */}
                <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                      Assigned Claim Agent
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      ● Active Officer
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* Agent Name */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-950 shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Agent Name</p>
                        <p className="text-sm sm:text-base font-bold text-slate-900">
                          Martin Brad Bales
                        </p>
                      </div>
                    </div>

                    {/* Agent Email */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-950 shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Official Email</p>
                        <a
                          href="mailto:agentmartbb@consultant.com"
                          className="text-sm sm:text-base font-bold text-blue-900 hover:text-blue-700 hover:underline break-all"
                        >
                          agentmartbb@consultant.com
                        </a>
                      </div>
                    </div>

                    {/* Agent Phone */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-950 shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">
                          Telephone / Direct Line
                        </p>
                        <a
                          href="tel:4062011622"
                          className="text-sm sm:text-base font-bold text-blue-900 hover:text-blue-700 hover:underline"
                        >
                          (406) 201-1622
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Reference Code Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-200 bg-blue-50/70 -mx-5 -mb-5 p-4 rounded-b-xl flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">
                      Required Reference Number:
                    </span>
                    <strong className="font-mono text-xs sm:text-sm bg-blue-900 text-white px-2.5 py-1 rounded shadow-sm">
                      {userData.refNumber}
                    </strong>
                  </div>
                </div>

                {/* Security Note */}
                <div className="mt-4 flex items-start gap-2 text-xs text-slate-500">
                  <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <p>
                    Please quote reference code{" "}
                    <strong className="font-mono text-slate-700">{userData.refNumber}</strong> when
                    contacting Agent Martin Brad Bales to ensure swift processing and package
                    dispatch.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="text-center pb-4">
            <Link to="/dashboard">
              <Button className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-8">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
