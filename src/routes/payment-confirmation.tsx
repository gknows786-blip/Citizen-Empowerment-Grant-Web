import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "../components/SiteLayout";
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
  Mail,
  FileCheck,
  Timer,
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

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

export function PaymentConfirmation() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // State for the 48-hour countdown timer
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 48, minutes: 0, seconds: 0 });

  // 1. Fetch Dashboard User Data
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

  // 2. 48-Hour Timer Logic (Persisted in localStorage)
  useEffect(() => {
    const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;
    const storageKey = "grant_claim_timer_end";

    let targetTime = localStorage.getItem(storageKey);

    if (!targetTime) {
      const newTargetTime = Date.now() + FORTY_EIGHT_HOURS_MS;
      localStorage.setItem(storageKey, newTargetTime.toString());
      targetTime = newTargetTime.toString();
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const difference = parseInt(targetTime!, 10) - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <SiteLayout>
        <div className="min-h-[60vh] bg-slate-100 flex items-center justify-center p-4">
          <div className="text-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <ShieldCheck className="w-8 h-8 text-blue-900 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">
              Loading claim details...
            </p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!userData) {
    return (
      <SiteLayout>
        <div className="min-h-[60vh] bg-slate-100 p-4 flex items-center justify-center">
          <div className="max-w-md w-full">
            <Alert className="bg-red-50 border-red-300 text-red-900 shadow-sm p-3">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
            </Alert>
            <div className="mt-3 text-center">
              <Link to="/dashboard">
                <Button size="sm" className="bg-blue-900 text-white">Return to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="min-h-screen bg-slate-100 py-4 px-3 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto space-y-3">
          
          {/* Back Link */}
          <div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-900 hover:text-blue-700 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Grant Dashboard</span>
            </Link>
          </div>

          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-950 to-blue-900 text-white p-4 sm:p-5 rounded-xl shadow-md text-center">
            <div className="inline-flex p-1.5 bg-blue-800/80 rounded-full text-amber-400 mb-1.5 ring-2 ring-blue-700/40">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold font-serif">
              Congratulations, {userData.firstName}!
            </h1>
            <p className="text-xs text-blue-100 mt-0.5">
              Your selected grant package has been recorded.
            </p>
          </div>

          {error && (
            <Alert className="bg-red-50 border-red-300 text-red-900 p-2.5">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-xs font-semibold">{error}</AlertDescription>
            </Alert>
          )}

          {/* Grant Selection Details Card */}
          <Card className="p-3.5 sm:p-4 bg-white shadow-sm border border-slate-200">
            <h2 className="text-sm font-bold font-serif text-blue-950 pb-2 mb-2.5 border-b border-slate-200 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-blue-900" />
              <span>Grant Selection Details</span>
            </h2>

            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Package</p>
                <p className="text-xs sm:text-sm font-bold text-blue-950 mt-0.5">{userData.selectedPackage}</p>
              </div>
              <div className="border-l border-slate-200 pl-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Grant Amount</p>
                <p className="text-sm sm:text-base font-extrabold text-emerald-700 mt-0.5">
                  ${userData.grantAmount?.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-2.5 flex flex-wrap justify-between gap-1 text-[11px] text-slate-600">
              <p>
                Beneficiary: <strong className="text-slate-900">{userData.firstName} {userData.lastName}</strong>
              </p>
              <p>
                Ref: <strong className="font-mono text-blue-900">{userData.refNumber}</strong>
              </p>
            </div>
          </Card>

          {/* COMPACT 48-HOUR TIMER CARD */}
          <Card className="p-3 bg-amber-50 border border-amber-300/80 shadow-sm rounded-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-amber-950 text-center sm:text-left">
                <Timer className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-tight">
                    Claim Window Closing Soon
                  </h3>
                  <p className="text-[11px] text-amber-900/90 leading-tight">
                    Contact your agent before time expires to prevent discarding your grant from database.
                  </p>
                </div>
              </div>

              {/* Compact Countdown */}
              <div className="flex items-center gap-1.5 bg-amber-100/80 border border-amber-300 px-2.5 py-1 rounded-md shrink-0">
                <div className="text-center min-w-[28px]">
                  <span className="block text-sm font-bold font-mono text-amber-950">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[8px] uppercase font-bold text-amber-800">hrs</span>
                </div>
                <span className="text-xs font-bold text-amber-700">:</span>
                <div className="text-center min-w-[28px]">
                  <span className="block text-sm font-bold font-mono text-amber-950">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[8px] uppercase font-bold text-amber-800">min</span>
                </div>
                <span className="text-xs font-bold text-amber-700">:</span>
                <div className="text-center min-w-[28px]">
                  <span className="block text-sm font-bold font-mono text-amber-950">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[8px] uppercase font-bold text-amber-800">sec</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Grant Recipients Section */}
          <div className="rounded-xl bg-white border border-slate-200 p-3.5 sm:p-4 shadow-sm w-full">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200 gap-2">
              <div>
                <h3 className="text-xs sm:text-sm font-bold font-serif text-blue-950 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Recent Delivery</span>
                </h3>
              </div>
              <span className="text-[9px] font-bold uppercase bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded-full">
                Verified
              </span>
            </div>

            {/* Image Grid Container */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {/* Proof 1 */}
              <div className="group rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
                <div className="relative aspect-[4/3] w-full bg-slate-200 overflow-hidden">
                  <img
                    src={grantProof1}
                    alt="Grant recipient 1"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-1.5 left-1.5 bg-blue-950/80 text-amber-300 text-[8px] font-bold px-1.5 py-0.5 rounded">
                    Delivered
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-[11px] font-bold text-slate-900 leading-tight">Delivery Confirmed</p>
                </div>
              </div>

              {/* Proof 2 */}
              <div className="group rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
                <div className="relative aspect-[4/3] w-full bg-slate-200 overflow-hidden">
                  <img
                    src={grantProof2}
                    alt="Grant recipient 2"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-1.5 left-1.5 bg-emerald-900/80 text-emerald-200 text-[8px] font-bold px-1.5 py-0.5 rounded">
                    Verified
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-[11px] font-bold text-slate-900 leading-tight">Disbursement Complete</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Card & Assigned Agent */}
          <Card className="p-3.5 sm:p-4 bg-white shadow-sm border border-slate-200 w-full">
            <h2 className="text-sm font-bold font-serif text-blue-950 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-blue-900" />
              <span>Do Next</span>
            </h2>

            <p className="text-xs text-slate-600 mt-1 leading-normal">
              Reach out directly to your assigned agent to confirm package dispatch.
            </p>

            {/* Compact Assigned Agent Container */}
            <div className="mt-3 rounded-lg bg-slate-50 border border-slate-200 p-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                  Assigned Agent
                </span>
                <span className="text-[9px] font-medium bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                  ● Active
                </span>
              </div>

              <div className="mb-3 flex items-center gap-2.5 bg-white p-2 rounded-md border border-slate-200">
                <div className="p-1.5 rounded-full bg-blue-100 text-blue-950 shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-medium leading-none">Delivery Administrator</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">Agent Martin Brad Bales</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {/* Email Button */}
                <a
                  href="mailto:agentmartbb@consultant.com"
                  className="flex items-center justify-between p-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg transition shadow-xs group w-full text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-semibold truncate">agentmartbb@consultant.com</span>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-400 text-blue-950 px-2 py-1 rounded shrink-0 group-hover:bg-amber-300">
                    Email
                  </span>
                </a>

                {/* Divider */}
                <div className="flex items-center my-1.5 w-full">
                  <hr className="flex-grow border-t border-gray-300" />
                  <span className="px-2 text-[10px] font-bold text-gray-400 uppercase">OR</span>
                  <hr className="flex-grow border-t border-gray-300" />
                </div>

                {/* Phone Button */}
                <a
                  href="https://wa.me/14062011622"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg transition shadow-xs group w-full text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-200 shrink-0" />
                    <span className="font-semibold">(406) 201-1622</span>
                  </div>
                  <span className="text-[10px] font-bold bg-white text-emerald-900 px-2 py-1 rounded shrink-0 group-hover:bg-slate-100">
                    Message
                  </span>
                </a>
              </div>

              {/* Reference Banner */}
              <div className="mt-3 pt-2 border-t border-slate-200 bg-blue-50/80 -mx-3 -mb-3 p-2 rounded-b-lg flex items-center justify-between">
                <span className="text-[10px] text-slate-600">Reference Code:</span>
                <strong className="font-mono text-[10px] bg-blue-950 text-amber-300 px-2 py-0.5 rounded border border-blue-900">
                  {userData.refNumber}
                </strong>
              </div>
            </div>

            {/* Helper Note */}
            <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-slate-500">
              <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
              <p className="leading-tight">
                Provide reference number <strong className="font-mono text-slate-700">{userData.refNumber}</strong> when contacting the agent.
              </p>
            </div>
          </Card>

          {/* Footer Action Button */}
          <div className="text-center pt-1 pb-2">
            <Link to="/dashboard">
              <Button size="sm" className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-6">
                Return to Dashboard
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </SiteLayout>
  );
}