import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import grantProof1 from './grant1.jpeg'; 
import grantProof2 from './grant2.jpeg';
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
          {/* Recent Grant Recipients Section */}
<div className="mt-6 rounded-2xl bg-white border border-slate-200 p-4 sm:p-6 lg:p-8 shadow-md w-full overflow-hidden">
  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-200 gap-2">
    <div>
      <h3 className="text-lg sm:text-xl font-bold font-serif text-blue-950 flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
        <span>Recent Beneficiaries & Proof of Delivery</span>
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 mt-1">
        See examples of verified applicants who recently received their grant packages.
      </p>
    </div>
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1 rounded-full w-fit">
      Verified Claims
    </span>
  </div>

  {/* Image Grid Container */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
    {/* Recipient Proof 1 */}
    <div className="group rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="relative aspect-[4/3] w-full bg-slate-200 overflow-hidden">
        <img
          src={grantProof1}
          alt="Grant recipient proof of delivery 1"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <div className="absolute top-3 left-3 bg-blue-950/80 backdrop-blur-md text-amber-300 text-[10px] font-bold font-mono px-2.5 py-1 rounded-md">
          Delivered
        </div>
      </div>
      <div className="p-3.5 sm:p-4">
        <p className="text-sm font-bold text-slate-900">
          Package Delivery Confirmation
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          Grant funds & documentation successfully received by beneficiary.
        </p>
      </div>
    </div>

    {/* Recipient Proof 2 */}
    <div className="group rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="relative aspect-[4/3] w-full bg-slate-200 overflow-hidden">
        <img
          src={grantProof2}
          alt="Grant recipient proof of delivery 2"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <div className="absolute top-3 left-3 bg-emerald-900/80 backdrop-blur-md text-emerald-200 text-[10px] font-bold font-mono px-2.5 py-1 rounded-md">
          Verified Grant
        </div>
      </div>
      <div className="p-3.5 sm:p-4">
        <p className="text-sm font-bold text-slate-900">
          Official Grant Disbursement
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          Processed and delivered through our assigned program officers.
        </p>
      </div>
    </div>
  </div>
</div>
<Card className="p-4 sm:p-6 lg:p-8 bg-white shadow-md border border-slate-200 w-full max-w-full overflow-hidden">
  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
    <div className="shrink-0 rounded-full bg-blue-100 p-2 text-blue-900">
      <Mail className="w-5 h-5" />
    </div>

    <div className="flex-1 min-w-0 w-full">
      <h2 className="text-lg sm:text-xl font-bold font-serif text-blue-950">
        Do Next
      </h2>

      <p className="text-sm text-slate-600 mt-2 leading-6">
        Your selection has been registered. Click on either contact button below
        to connect directly with your assigned program agent and arrange the
        delivery of your grant package.
      </p>

      {/* Assigned Agent Card */}
      <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 p-3 sm:p-5 shadow-sm w-full overflow-hidden">

        {/* Agent Card Header */}
        <div className="flex flex-col xs:flex-row sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 mb-4 border-b border-slate-200">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Assigned Claim Agent
          </span>

          <span className="inline-flex w-fit items-center gap-1 text-[11px] font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            ● Active Officer
          </span>
        </div>

        {/* Agent Info */}
        <div className="mb-5 flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 min-w-0">
          <div className="p-2.5 rounded-full bg-blue-100 text-blue-950 shrink-0">
            <User className="w-5 h-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-500 font-medium">
              Delivery Administrator
            </p>

            <p className="text-sm sm:text-base font-bold text-slate-900 break-words">
              Agent Martin Brad Bales
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">

          {/* Email Button */}
          {/* Email Button */}
<a
  href="mailto:agentmartbb@consultant.com"
  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-3.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl transition shadow-sm group w-full min-w-0"
>
  <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
    <Mail className="w-5 h-5 text-amber-400 shrink-0" />

    <div className="text-left min-w-0 flex-1">
      <p className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">
        Click To Send Email
      </p>

      <p className="text-xs sm:text-sm font-semibold break-all sm:truncate">
        agentmartbb@consultant.com
      </p>
    </div>
  </div>

  <span className="text-xs font-bold bg-amber-400 text-blue-950 px-2.5 py-1.5 rounded shrink-0 w-full sm:w-auto text-center group-hover:bg-amber-300">
    Send Email
  </span>
</a>

{/* Divider: Line - OR - Line */}
<div className="flex items-center my-3 w-full">
  <hr className="flex-grow border-t border-gray-300" />
  <span className="px-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
    OR
  </span>
  <hr className="flex-grow border-t border-gray-300" />
</div>

{/* Phone Button */}
<a
  href="https://wa.me/14062011622"
  target="_blank"
  rel="noopener noreferrer"
  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-3.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl transition shadow-sm group w-full min-w-0"
>
  Chat on WhatsApp
</a>
  <div className="flex items-center gap-3 min-w-0">
    <Phone className="w-5 h-5 text-emerald-200 shrink-0" />

    <div className="text-left min-w-0">
      <p className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider">
        Click To Message Directly
      </p>

      <p className="text-xs sm:text-sm font-semibold">
        (406) 201-1622
      </p>
    </div>
  </div>

  <span className="text-xs font-bold bg-white text-emerald-900 px-2.5 py-1.5 rounded shrink-0 w-full sm:w-auto text-center group-hover:bg-slate-100">
    Call Agent
  </span>
</a>
        </div>

        {/* Reference Code Banner */}
        <div className="mt-5 pt-3 border-t border-slate-200 bg-blue-50/80 -mx-3 sm:-mx-5 -mb-3 sm:-mb-5 p-3 sm:p-4 rounded-b-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-xs text-slate-600 font-medium">
            Your Reference Code:
          </span>

          <strong className="font-mono text-xs sm:text-sm bg-blue-950 text-amber-300 px-3 py-1.5 rounded shadow-sm border border-blue-900 break-all w-fit max-w-full">
            {userData.refNumber}
          </strong>
        </div>
      </div>

      {/* Helper Note */}
      <div className="mt-4 flex items-start gap-2 text-xs text-slate-500">
        <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />

        <p className="leading-5 min-w-0">
          Simply tap or click either button above to contact Agent Martin Brad
          Bales. Make sure to provide your reference number{" "}
          <strong className="font-mono text-slate-700 break-all">
            {userData.refNumber}
          </strong>{" "}
          when prompted.
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
