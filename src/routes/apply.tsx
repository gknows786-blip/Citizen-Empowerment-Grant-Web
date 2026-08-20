import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { z } from "zod";

import { SiteLayout } from "@/components/SiteLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle,
  ShieldCheck,
  FileText,
  UserPlus,
  LogIn,
  Loader2,
  Lock,
  Mail,
  Phone,
  Calendar,
  Building,
  MapPin,
} from "lucide-react";

import { signupServerFn, signinServerFn } from "@/lib/serverFunctions";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      {
        title: "Grant Application Portal — U.S. Federal Citizen Grant Program",
      },
      {
        name: "description",
        content: "Apply for your federal grant allocation or sign in to track your grant status.",
      },
    ],
  }),
  component: Apply,
});

const signupSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    phone: z.string().regex(/^\+?[\d\s()-]{10,}$/, "Enter a valid phone number (at least 10 digits)"),
    dateOfBirth: z.string().refine((date) => {
      if (!date) return false;
      const birthDate = new Date(date);
      if (Number.isNaN(birthDate.getTime())) {
        return false;
      }
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 18;
    }, "Applicant must be 18 years or older"),
    gender: z.enum(["Male", "Female", "Other"]),
    occupation: z.string().min(2, "Occupation is required"),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z.string().regex(/^[\dA-Za-z\s-]{3,10}$/, "Enter a valid postal code"),
    country: z.string().min(2, "Country is required"),
    maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed"]),
    confidentiality: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and confirmation",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const signinSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignupData = z.infer<typeof signupSchema>;
type SigninData = z.infer<typeof signinSchema>;

function Apply() {
  const navigate = useNavigate();

  const [signupData, setSignupData] = useState<Partial<SignupData>>({});
  const [signinData, setSigninData] = useState<Partial<SigninData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [refNumber, setRefNumber] = useState<string | null>(null);

  const handleSignupChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setSignupData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => {
        const next = { ...previous };
        delete next[name];
        return next;
      });
    }
  };

  const handleSigninChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSigninData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => {
        const next = { ...previous };
        delete next[name];
        return next;
      });
    }
  };

  const handleSignupSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setSuccess("");
    setLoading(true);

    try {
      const validation = signupSchema.safeParse(signupData);

      if (!validation.success) {
        const nextErrors: Record<string, string> = {};
        validation.error.issues.forEach((issue) => {
          const path = issue.path.join(".");
          if (!nextErrors[path]) {
            nextErrors[path] = issue.message;
          }
        });
        setErrors(nextErrors);
        setLoading(false);
        return;
      }

      const result = await signupServerFn({
        data: {
          firstName: validation.data.firstName,
          lastName: validation.data.lastName,
          email: validation.data.email,
          password: validation.data.password,
          phone: validation.data.phone,
          dateOfBirth: validation.data.dateOfBirth,
          gender: validation.data.gender,
          occupation: validation.data.occupation,
          address: validation.data.address,
          city: validation.data.city,
          state: validation.data.state,
          zipCode: validation.data.zipCode,
          country: validation.data.country,
          maritalStatus: validation.data.maritalStatus,
        },
      });

      if (result.success && result.token && result.user) {
        localStorage.setItem("token", result.token);
        setRefNumber(result.user.refNumber);
        setSuccess(`Registration successful! Reference Number: ${result.user.refNumber}`);

        setTimeout(() => {
          navigate({ to: "/dashboard" });
        }, 1500);
      } else {
        setErrors({
          form: result.error || "Registration could not be completed.",
        });
      }
    } catch (err: any) {
      setErrors({
        form: err.message || "Unable to connect to the application server.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSigninSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setSuccess("");
    setLoading(true);

    try {
      const validation = signinSchema.safeParse(signinData);

      if (!validation.success) {
        const nextErrors: Record<string, string> = {};
        validation.error.issues.forEach((issue) => {
          const path = issue.path.join(".");
          if (!nextErrors[path]) {
            nextErrors[path] = issue.message;
          }
        });
        setErrors(nextErrors);
        setLoading(false);
        return;
      }

      const result = await signinServerFn({
        data: {
          email: validation.data.email,
          password: validation.data.password,
        },
      });

      if (result.success && result.token) {
        localStorage.setItem("token", result.token);
        setSuccess("Login successful. Redirecting to your dashboard...");

        setTimeout(() => {
          navigate({ to: "/dashboard" });
        }, 1200);
      } else {
        setErrors({
          form: result.error || "Login failed. Please check your credentials.",
        });
      }
    } catch (err: any) {
      setErrors({
        form: err.message || "Unable to connect to the application server.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-blue-950 via-slate-900 to-slate-100 py-10 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-800 text-blue-200 mb-4 ring-4 ring-blue-700/50 shadow-lg">
              <FileText className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Federal Grant Application Portal
            </h1>
            <p className="mt-2 text-sm sm:text-base text-blue-200">
              Submit your official application or sign in to track your grant status.
            </p>
          </div>

          {/* Demonstration Notice */}
          <Alert className="mb-6 border-amber-400/50 bg-amber-50/95 shadow-sm">
            <ShieldCheck className="h-5 w-5 text-amber-700" />
            <AlertDescription className="text-amber-900 text-xs sm:text-sm font-medium">
              Official Federal Portal: Complete your application truthfully. Your unique grant reference number will be issued upon registration.
            </AlertDescription>
          </Alert>

          {success && (
            <Alert className="mb-6 border-emerald-500 bg-emerald-50 text-emerald-900 shadow-md">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <AlertDescription className="font-semibold text-sm sm:text-base">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {errors["form"] && (
            <Alert className="mb-6 border-red-500 bg-red-50 text-red-900 shadow-md">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="font-semibold text-sm">{errors["form"]}</AlertDescription>
            </Alert>
          )}

          {/* Form Card */}
          <div className="rounded-xl bg-white p-6 sm:p-10 shadow-2xl border border-slate-200">
            <Tabs defaultValue="signup" className="w-full">
              <TabsList className="mb-8 grid w-full grid-cols-2 p-1 bg-slate-100 rounded-lg">
                <TabsTrigger
                  value="signup"
                  className="flex items-center justify-center gap-2 py-2.5 font-semibold text-slate-700 data-[state=active]:bg-blue-900 data-[state=active]:text-white rounded-md transition"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </TabsTrigger>
                <TabsTrigger
                  value="signin"
                  className="flex items-center justify-center gap-2 py-2.5 font-semibold text-slate-700 data-[state=active]:bg-blue-900 data-[state=active]:text-white rounded-md transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </TabsTrigger>
              </TabsList>

              {/* Registration Tab */}
              <TabsContent value="signup">
                <form onSubmit={handleSignupSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-3 pb-1 border-b border-slate-200">
                      1. Personal Information
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        id="firstName"
                        name="firstName"
                        label="First Name"
                        placeholder="John"
                        value={signupData.firstName || ""}
                        error={errors["firstName"]}
                        onChange={handleSignupChange}
                      />
                      <FormField
                        id="lastName"
                        name="lastName"
                        label="Last Name"
                        placeholder="Doe"
                        value={signupData.lastName || ""}
                        error={errors["lastName"]}
                        onChange={handleSignupChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      id="email"
                      name="email"
                      type="email"
                      label="Email Address"
                      placeholder="john.doe@example.com"
                      value={signupData.email || ""}
                      error={errors["email"]}
                      onChange={handleSignupChange}
                    />
                    <FormField
                      id="phone"
                      name="phone"
                      type="tel"
                      label="Phone Number"
                      placeholder="+1 (555) 000-0000"
                      value={signupData.phone || ""}
                      error={errors["phone"]}
                      onChange={handleSignupChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      label="Date of Birth (Must be 18+)"
                      value={signupData.dateOfBirth || ""}
                      error={errors["dateOfBirth"]}
                      onChange={handleSignupChange}
                    />

                    <div>
                      <Label htmlFor="gender" className="text-xs font-bold text-slate-700">
                        Gender <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="gender"
                        name="gender"
                        value={signupData.gender || ""}
                        onChange={handleSignupChange}
                        className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors["gender"] && <ErrorText>{errors["gender"]}</ErrorText>}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-3 pb-1 border-b border-slate-200">
                      2. Residence &amp; Profile Details
                    </h3>
                    <div className="space-y-4">
                      <FormField
                        id="occupation"
                        name="occupation"
                        label="Occupation / Employment"
                        placeholder="e.g. Healthcare Worker, Engineer, Teacher, Retired"
                        value={signupData.occupation || ""}
                        error={errors["occupation"]}
                        onChange={handleSignupChange}
                      />

                      <FormField
                        id="address"
                        name="address"
                        label="Residential Address (For Secure Grant Delivery)"
                        placeholder="Street Address, Apt / Suite"
                        value={signupData.address || ""}
                        error={errors["address"]}
                        onChange={handleSignupChange}
                      />

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <FormField
                          id="city"
                          name="city"
                          label="City"
                          placeholder="City"
                          value={signupData.city || ""}
                          error={errors["city"]}
                          onChange={handleSignupChange}
                        />
                        <FormField
                          id="state"
                          name="state"
                          label="State / Province"
                          placeholder="e.g. California, Texas"
                          value={signupData.state || ""}
                          error={errors["state"]}
                          onChange={handleSignupChange}
                        />
                        <FormField
                          id="zipCode"
                          name="zipCode"
                          label="Postal / ZIP Code"
                          placeholder="ZIP Code"
                          value={signupData.zipCode || ""}
                          error={errors["zipCode"]}
                          onChange={handleSignupChange}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="country" className="text-xs font-bold text-slate-700">
                            Country <span className="text-red-500">*</span>
                          </Label>
                          <select
                            id="country"
                            name="country"
                            value={signupData.country || ""}
                            onChange={handleSignupChange}
                            className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                          >
                            <option value="">Select Country</option>
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Australia">Australia</option>
                            <option value="Nigeria">Nigeria</option>
                            <option value="Other">Other</option>
                          </select>
                          {errors["country"] && <ErrorText>{errors["country"]}</ErrorText>}
                        </div>

                        <div>
                          <Label htmlFor="maritalStatus" className="text-xs font-bold text-slate-700">
                            Marital Status <span className="text-red-500">*</span>
                          </Label>
                          <select
                            id="maritalStatus"
                            name="maritalStatus"
                            value={signupData.maritalStatus || ""}
                            onChange={handleSignupChange}
                            className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                          >
                            <option value="">Select Status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                          </select>
                          {errors["maritalStatus"] && <ErrorText>{errors["maritalStatus"]}</ErrorText>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-3 pb-1 border-b border-slate-200">
                      3. Security &amp; Password
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        id="password"
                        name="password"
                        type="password"
                        label="Password (min. 8 chars)"
                        placeholder="••••••••"
                        value={signupData.password || ""}
                        error={errors["password"]}
                        onChange={handleSignupChange}
                      />
                      <FormField
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        label="Confirm Password"
                        placeholder="••••••••"
                        value={signupData.confirmPassword || ""}
                        error={errors["confirmPassword"]}
                        onChange={handleSignupChange}
                      />
                    </div>
                  </div>

                  {/* Terms & Acknowledgement */}
                  <div className="rounded-lg border border-blue-200 bg-blue-50/70 p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="confidentiality"
                        checked={signupData.confidentiality === true}
                        onCheckedChange={(checked) => {
                          setSignupData((previous) => ({
                            ...previous,
                            confidentiality: checked === true,
                          }));
                          if (errors["confidentiality"]) {
                            setErrors((previous) => {
                              const next = { ...previous };
                              delete next["confidentiality"];
                              return next;
                            });
                          }
                        }}
                      />
                      <Label
                        htmlFor="confidentiality"
                        className="cursor-pointer text-xs sm:text-sm leading-relaxed text-blue-950 font-medium"
                      >
                        I certify that all information provided is accurate and agree to receive official correspondence regarding this grant allocation.
                      </Label>
                    </div>
                    {errors["confidentiality"] && (
                      <ErrorText>{errors["confidentiality"]}</ErrorText>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 text-base shadow-lg transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing Registration...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        <span>Submit Application &amp; Create Account</span>
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Sign In Tab */}
              <TabsContent value="signin">
                <form onSubmit={handleSigninSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      id="signin-email"
                      name="email"
                      type="email"
                      label="Email Address"
                      placeholder="your.email@example.com"
                      value={signinData.email || ""}
                      error={errors["email"]}
                      onChange={handleSigninChange}
                    />

                    <FormField
                      id="signin-password"
                      name="password"
                      type="password"
                      label="Password"
                      placeholder="••••••••"
                      value={signinData.password || ""}
                      error={errors["password"]}
                      onChange={handleSigninChange}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 text-base shadow-lg transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        <span>Sign In to Dashboard</span>
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>

          {/* Reference Number Preview */}
          {refNumber && (
            <div className="mt-8 rounded-xl border-2 border-emerald-400 bg-emerald-50 p-6 text-center shadow-lg">
              <p className="font-semibold text-emerald-800 text-sm uppercase tracking-wide">
                Your Official Federal Application Reference:
              </p>
              <p className="mt-2 font-mono text-3xl font-bold text-blue-950 tracking-wider">
                {refNumber}
              </p>
              <p className="text-xs text-emerald-700 mt-2">
                Keep this number secure. Redirecting to your dashboard...
              </p>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}

interface FormFieldProperties {
  id: string;
  name: string;
  label: string;
  value: string;
  error?: string | undefined;
  type?: string | undefined;
  placeholder?: string | undefined;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function FormField({
  id,
  name,
  label,
  value,
  error,
  type = "text",
  placeholder,
  onChange,
}: FormFieldProperties) {
  return (
    <div>
      <Label htmlFor={id} className="text-xs font-bold text-slate-700">
        {label} <span className="text-red-500">*</span>
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`mt-1.5 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 ${
          error ? "border-red-500 ring-1 ring-red-500" : ""
        }`}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ children }: { children: string }) {
  return <p className="mt-1 text-xs font-medium text-red-600">{children}</p>;
}
