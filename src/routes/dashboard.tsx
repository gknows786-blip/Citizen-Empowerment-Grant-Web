import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import {
  getDashboardDataServerFn,
  getGrantPackagesServerFn,
  selectPackageServerFn,
} from "@/lib/serverFunctions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle,
  LogOut,
  Printer,
  ShieldCheck,
  DollarSign,
  Truck,
  Clock,
  KeyRound,
  Award,
  Medal,
  Trophy,
  Gem,
  Crown,
  Loader2,
  ArrowRight,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Grant Dashboard — U.S. Federal Citizen Grant Program" },
      {
        name: "description",
        content:
          "Access your official federal grant dashboard, review claim status, and choose your grant allocation.",
      },
    ],
  }),
  component: Dashboard,
});

interface DashboardData {
  firstName: string;
  lastName: string;
  refNumber: string;
  paymentStatus: string;
  selectedPackage: string | null;
  grantAmount: number | null;
  feeAmount: number | null;
  profile: {
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    dateOfBirth: string;
    gender: string;
    occupation: string;
    maritalStatus: string;
    personalIdNumber?: string | null;
  };
}

interface GrantPackage {
  name: string;
  grantAmount: number;
  feeRequired: number;
}

function getPackageIcon(name: string) {
  switch (name) {
    case "Basic":
      return <Award className="w-8 h-8 text-amber-700 mx-auto mb-2" />;
    case "Silver":
      return <Medal className="w-8 h-8 text-slate-400 mx-auto mb-2" />;
    case "Gold":
      return <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />;
    case "Platinum":
      return <Gem className="w-8 h-8 text-cyan-500 mx-auto mb-2" />;
    case "Diamond":
      return <Crown className="w-8 h-8 text-amber-500 mx-auto mb-2" />;
    default:
      return <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />;
  }
}

function Dashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [packages, setPackages] = useState<GrantPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectingPackage, setSelectingPackage] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate({ to: "/apply", search: { tab: "signup" } });
          return;
        }

        // Fetch dashboard data
        const dashResult = await getDashboardDataServerFn({ data: { token } });
        if (dashResult.success && dashResult.data) {
          setDashboardData(dashResult.data as DashboardData);
        } else {
          setError(dashResult.error || "Failed to load dashboard data");
        }

        // Fetch packages
        const pkgResult = await getGrantPackagesServerFn();
        if (pkgResult.success && pkgResult.packages) {
          setPackages(pkgResult.packages);
        }
      } catch (err: any) {
        setError("Failed to load dashboard data. Please try logging in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleSelectPackage = async (packageName: string) => {
    setSelectingPackage(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Session expired. Please login again.");
        navigate({ to: "/apply", search: { tab: "signup" } });
        return;
      }

      const result = await selectPackageServerFn({
        data: {
          token,
          packageName,
        },
      });

      if (result.success) {
        setSuccess(
          `Success: ${packageName} package selected! Proceed below to complete your payment clearance.`,
        );
        // Refresh dashboard data
        const dashResult = await getDashboardDataServerFn({ data: { token } });
        if (dashResult.success && dashResult.data) {
          setDashboardData(dashResult.data as DashboardData);
        }
      } else {
        setError(result.error || "Failed to select package");
      }
    } catch (err: any) {
      setError("An error occurred while selecting the package");
    } finally {
      setSelectingPackage(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate({ to: "/" });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="min-h-[70vh] bg-slate-100 flex items-center justify-center p-4">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-slate-200">
            <Loader2 className="w-12 h-12 animate-spin text-blue-900 mx-auto mb-4" />
            <p className="text-lg font-semibold text-slate-800">
              Retrieving Official Federal Records...
            </p>
            <p className="text-xs text-slate-500 mt-1">Authenticating secure credentials</p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!dashboardData) {
    return (
      <SiteLayout>
        <div className="min-h-[70vh] bg-slate-100 p-6 flex items-center justify-center">
          <div className="max-w-md w-full">
            <Alert className="bg-red-50 border-red-300 text-red-900 shadow-md">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="font-medium">
                {error || "Unable to load dashboard. Please try signing in again."}
              </AlertDescription>
            </Alert>
            <div className="mt-4 text-center">
              <Button
                onClick={() => navigate({ to: "/apply", search: { tab: "signup" } })}
                className="bg-blue-900 hover:bg-blue-800 text-white"
              >
                Go to Sign In
              </Button>
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Bar */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-blue-800" />
                <span>Verified Federal Beneficiary Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mt-1">
                Welcome, {dashboardData.firstName} {dashboardData.lastName}
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                Application Reference:{" "}
                <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {dashboardData.refNumber}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handlePrint} variant="outline" size="sm" className="gap-1.5 border-slate-300 text-slate-700">
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print Claim Slip</span>
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm" className="gap-1.5 border-red-200 text-red-700 hover:bg-red-50">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>

          {/* Status Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl p-5 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Allocation Approved &amp; Active
                </p>
                <h2 className="text-lg font-bold">
                  {dashboardData.selectedPackage
                    ? `Package: ${dashboardData.selectedPackage} ($${dashboardData.grantAmount?.toLocaleString()})`
                    : "Action Required: Please Select Your Approved Grant Package Below"}
                </h2>
              </div>
            </div>

            {dashboardData.selectedPackage && (
              <Link to="/payment-confirmation" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-md">
                  <span>Confirm Delivery &amp; Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>

          {/* Success Message */}
          {success && (
            <Alert className="bg-emerald-50 border-emerald-400 text-emerald-950 shadow-sm">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <AlertDescription className="font-semibold">{success}</AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert className="bg-red-50 border-red-300 text-red-900 shadow-sm">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="font-semibold">{error}</AlertDescription>
            </Alert>
          )}

          {/* Stats Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 bg-white shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Grant Allocation</p>
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-2">
                {dashboardData.grantAmount ? `$${dashboardData.grantAmount.toLocaleString()}` : "Pending"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {dashboardData.selectedPackage ? `${dashboardData.selectedPackage} Tier` : "Select tier below"}
              </p>
            </Card>

            <Card className="p-5 bg-white shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Disbursement Status</p>
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              <div className="mt-2">
                {dashboardData.paymentStatus === "pending" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    <Clock className="w-3.5 h-3.5" /> Pending Clearance
                  </span>
                )}
                {dashboardData.paymentStatus === "paid" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle className="w-3.5 h-3.5" /> Ready For Delivery
                  </span>
                )}
                {dashboardData.paymentStatus === "delivered" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                    <CheckCircle className="w-3.5 h-3.5" /> Successfully Delivered
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2">Insured Delivery via UPS/FedEx</p>
            </Card>

            <Card className="p-5 bg-white shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Processing Window</p>
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-2">48 Hours</p>
              <p className="text-xs text-slate-500 mt-1">Federal claim clearance window</p>
            </Card>

            <Card className="p-5 bg-white shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Secure Reference</p>
                <KeyRound className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-xl font-mono font-bold text-indigo-900 mt-2 truncate">
                {dashboardData.refNumber}
              </p>
              <p className="text-xs text-slate-500 mt-1">Confidential unique claim ID</p>
            </Card>
          </div>

          {/* Grant Packages Selection Grid */}
          <Card className="p-6 sm:p-8 bg-white shadow-md border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-6 border-b border-slate-200 gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-blue-950 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Choose Your Grant Package Allocation</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Select your approved grant amount. Each tier includes federal clearance and insured secure home delivery.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {packages.map((pkg) => {
                const isSelected = dashboardData.selectedPackage === pkg.name;
                return (
                  <div
                    key={pkg.name}
                    className={`relative rounded-xl p-5 text-center transition-all border-2 flex flex-col justify-between ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/30"
                        : "border-slate-200 bg-white hover:border-blue-400 hover:shadow"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                        Active Tier
                      </span>
                    )}
                    <div>
                      {getPackageIcon(pkg.name)}
                      <h3 className="font-bold text-base text-slate-900">{pkg.name}</h3>
                      <div className="my-3">
                        <p className="text-2xl font-extrabold text-emerald-700">
                          ${pkg.grantAmount.toLocaleString()}
                        </p>
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          Federal Allocation
                        </p>
                      </div>
                      <div className="border-t border-slate-100 pt-2 mb-4 text-xs text-slate-600">
                        Clearance Fee: <span className="font-bold text-slate-900">${pkg.feeRequired}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleSelectPackage(pkg.name)}
                      disabled={selectingPackage || isSelected}
                      size="sm"
                      className={`w-full font-bold text-xs ${
                        isSelected
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-default"
                          : "bg-blue-900 hover:bg-blue-800 text-white"
                      }`}
                    >
                      {isSelected ? "Selected" : "Select Package"}
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Next Step CTA Banner when package is selected */}
            {dashboardData.selectedPackage && (
              <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <p className="font-bold text-blue-950 text-sm">
                    Ready to complete delivery clearance?
                  </p>
                  <p className="text-xs text-blue-700">
                    Selected Package: <strong>{dashboardData.selectedPackage}</strong> (${dashboardData.grantAmount?.toLocaleString()})
                  </p>
                </div>
                <Link to="/payment-confirmation">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 gap-2 shadow">
                    <span>Proceed to Official Payment Confirmation</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Profile & Claim Information Card */}
          <Card className="p-6 sm:p-8 bg-white shadow-md border border-slate-200">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-blue-950 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-900" />
                <span>Beneficiary Profile &amp; Delivery Address</span>
              </h2>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Verified Identity
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase">Full Legal Name</p>
                <p className="font-semibold text-slate-900">
                  {dashboardData.firstName} {dashboardData.lastName}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase">Email Address</p>
                <p className="font-semibold text-slate-900 truncate">
                  {dashboardData.profile.email}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase">Phone Number</p>
                <p className="font-semibold text-slate-900">
                  {dashboardData.profile.phone}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase">Date of Birth</p>
                <p className="font-semibold text-slate-900">
                  {dashboardData.profile.dateOfBirth}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase">Occupation</p>
                <p className="font-semibold text-slate-900">
                  {dashboardData.profile.occupation}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase">Marital Status</p>
                <p className="font-semibold text-slate-900">
                  {dashboardData.profile.maritalStatus}
                </p>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase">Delivery Address</p>
                <p className="font-semibold text-slate-900">
                  {dashboardData.profile.address}, {dashboardData.profile.city},{" "}
                  {dashboardData.profile.state} {dashboardData.profile.zipCode},{" "}
                  {dashboardData.profile.country}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </SiteLayout>
  );
}

