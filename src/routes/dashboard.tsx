import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { getDashboardDataServerFn, getGrantPackagesServerFn, selectPackageServerFn } from "@/lib/serverFunctions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, LogOut, Download } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Dashboard — U.S. Federal Citizen Grant Program" },
      {
        name: "description",
        content: "Access your grant dashboard, view your claim status, and select your grant package.",
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
    personalIdNumber: string | null;
  };
}

interface GrantPackage {
  name: string;
  grantAmount: number;
  feeRequired: number;
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
          navigate({ to: "/apply" });
          return;
        }

        // Fetch dashboard data
        const dashResult = await getDashboardDataServerFn(token);
        if (dashResult.success) {
          setDashboardData(dashResult.data as DashboardData);
        } else {
          setError(dashResult.error || "Failed to load dashboard");
        }

        // Fetch packages
        const pkgResult = await getGrantPackagesServerFn();
        if (pkgResult.success) {
          setPackages(pkgResult.packages || []);
        }
      } catch (err) {
        setError("Failed to load dashboard data");
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
        navigate({ to: "/apply" });
        return;
      }

      const result = await selectPackageServerFn({
        token,
        packageName,
      });

      if (result.success) {
        setSuccess(`✅ ${packageName} package selected! Check your email for payment instructions.`);
        // Refresh dashboard data
        const dashResult = await getDashboardDataServerFn(token);
        if (dashResult.success) {
          setDashboardData(dashResult.data as DashboardData);
        }
      } else {
        setError(result.error || "Failed to select package");
      }
    } catch (err) {
      setError("An error occurred while selecting the package");
    } finally {
      setSelectingPackage(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate({ to: "/" });
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-xl text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!dashboardData) {
    return (
      <SiteLayout>
        <div className="min-h-screen bg-gray-100 p-4">
          <div className="max-w-7xl mx-auto">
            <Alert className="bg-red-50 border-red-300">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error || "Unable to load dashboard"}</AlertDescription>
            </Alert>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
        <div className="px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-blue-900 font-serif mb-2">
                  Welcome, {dashboardData.firstName}!
                </h1>
                <p className="text-gray-600">
                  Reference Number: <span className="font-mono font-bold text-blue-900">{dashboardData.refNumber}</span>
                </p>
              </div>
              <Button onClick={handleLogout} variant="outline" className="gap-2">
                <LogOut size={20} />
                Logout
              </Button>
            </div>

            {/* Status Banner */}
            <Alert className="mb-8 bg-green-50 border-green-300">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800 text-lg font-semibold">
                Status: ✅ CLAIM APPROVED - PENDING PACKAGE SELECTION
              </AlertDescription>
            </Alert>

            {/* Success Message */}
            {success && (
              <Alert className="mb-8 bg-green-50 border-green-300">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            {/* Error Message */}
            {error && (
              <Alert className="mb-8 bg-red-50 border-red-300">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 bg-white shadow-lg">
                <p className="text-gray-600 text-sm font-semibold mb-2">Grant Amount Available</p>
                <p className="text-3xl font-bold text-green-600">
                  ${dashboardData.grantAmount ? dashboardData.grantAmount.toLocaleString() : "N/A"}
                </p>
                <p className="text-xs text-gray-500 mt-2">{dashboardData.selectedPackage || "No package selected"}</p>
              </Card>

              <Card className="p-6 bg-white shadow-lg">
                <p className="text-gray-600 text-sm font-semibold mb-2">Delivery Status</p>
                <p className="text-lg font-bold text-blue-600">
                  {dashboardData.paymentStatus === "pending" && "⏳ Processing - UPS/FedEx"}
                  {dashboardData.paymentStatus === "paid" && "🚚 Ready for Delivery"}
                  {dashboardData.paymentStatus === "delivered" && "✅ Delivered"}
                </p>
              </Card>

              <Card className="p-6 bg-white shadow-lg">
                <p className="text-gray-600 text-sm font-semibold mb-2">Days Remaining</p>
                <p className="text-3xl font-bold text-orange-600">23</p>
                <p className="text-xs text-gray-500 mt-2">Until unclaimed</p>
              </Card>

              <Card className="p-6 bg-white shadow-lg">
                <p className="text-gray-600 text-sm font-semibold mb-2">Your Unique Code</p>
                <p className="text-xl font-mono font-bold text-purple-600">{dashboardData.refNumber}</p>
                <p className="text-xs text-gray-500 mt-2">Keep confidential</p>
              </Card>
            </div>

            {/* Profile Section */}
            <Card className="p-8 bg-white shadow-lg mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-900 font-serif">Your Claim Details</h2>
                <Button variant="outline" className="gap-2">
                  <Download size={18} />
                  Download PDF
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-b pb-4">
                  <p className="text-gray-600 text-sm">Full Name</p>
                  <p className="text-lg font-semibold text-blue-900">
                    {dashboardData.firstName} {dashboardData.lastName}
                  </p>
                </div>
                <div className="border-b pb-4">
                  <p className="text-gray-600 text-sm">Email Address</p>
                  <p className="text-lg font-semibold text-blue-900">{dashboardData.profile.email}</p>
                </div>
                <div className="border-b pb-4">
                  <p className="text-gray-600 text-sm">Phone Number</p>
                  <p className="text-lg font-semibold text-blue-900">{dashboardData.profile.phone}</p>
                </div>
                <div className="border-b pb-4">
                  <p className="text-gray-600 text-sm">Date of Birth</p>
                  <p className="text-lg font-semibold text-blue-900">{dashboardData.profile.dateOfBirth}</p>
                </div>
                <div className="border-b pb-4">
                  <p className="text-gray-600 text-sm">Address</p>
                  <p className="text-lg font-semibold text-blue-900">{dashboardData.profile.address}</p>
                </div>
                <div className="border-b pb-4">
                  <p className="text-gray-600 text-sm">City, State, ZIP</p>
                  <p className="text-lg font-semibold text-blue-900">
                    {dashboardData.profile.city}, {dashboardData.profile.state} {dashboardData.profile.zipCode}
                  </p>
                </div>
                <div className="border-b pb-4">
                  <p className="text-gray-600 text-sm">Country</p>
                  <p className="text-lg font-semibold text-blue-900">{dashboardData.profile.country}</p>
                </div>
                <div className="border-b pb-4">
                  <p className="text-gray-600 text-sm">Occupation</p>
                  <p className="text-lg font-semibold text-blue-900">{dashboardData.profile.occupation}</p>
                </div>
              </div>
            </Card>

            {/* Grant Packages Section */}
            <Card className="p-8 bg-white shadow-lg">
              <h2 className="text-2xl font-bold text-blue-900 font-serif mb-4">Select Your Grant Package</h2>
              <p className="text-gray-700 mb-6">
                Choose the amount you wish to receive. A mandatory Tax Clearance & Shipping Fee is required before delivery.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {packages.map((pkg) => (
                  <Card
                    key={pkg.name}
                    className={`p-6 text-center border-2 hover:shadow-lg transition cursor-pointer ${
                      dashboardData.selectedPackage === pkg.name
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="text-3xl mb-3">
                      {pkg.name === "Basic" && "🥉"}
                      {pkg.name === "Silver" && "🥈"}
                      {pkg.name === "Gold" && "🥇"}
                      {pkg.name === "Platinum" && "💎"}
                      {pkg.name === "Diamond" && "👑"}
                    </div>
                    <h3 className="font-bold text-lg text-blue-900 mb-3">{pkg.name}</h3>
                    <div className="mb-4">
                      <p className="text-2xl font-bold text-green-600">${pkg.grantAmount.toLocaleString()}</p>
                      <p className="text-xs text-gray-600 mt-1">Grant Amount</p>
                    </div>
                    <div className="mb-4 pb-4 border-b">
                      <p className="text-sm font-semibold text-gray-700">Fee: ${pkg.feeRequired}</p>
                    </div>
                    <Button
                      onClick={() => handleSelectPackage(pkg.name)}
                      disabled={selectingPackage || dashboardData.selectedPackage === pkg.name}
                      className={`w-full ${
                        dashboardData.selectedPackage === pkg.name
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {dashboardData.selectedPackage === pkg.name ? "✅ Selected" : "Select"}
                    </Button>
                  </Card>
                ))}
              </div>

              <Alert className="bg-yellow-50 border-yellow-300">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Note:</strong> Fees cover tax clearance, legal processing, and insured home delivery via UPS/FedEx. These are non-refundable government processing fees.
                </AlertDescription>
              </Alert>
            </Card>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
