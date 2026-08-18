import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/SiteLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signupServerFn, signinServerFn } from "@/lib/serverFunctions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Official Grant Claim Form — U.S. Federal Citizen Grant Program" },
      {
        name: "description",
        content: "Submit your official grant claim and identity verification form. Secure, government-verified portal.",
      },
    ],
  }),
  component: Apply,
});

const signupSchema = z.object({
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(2, "Last name required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(8, "Password must be 8+ characters"),
  confirmPassword: z.string(),
  phone: z.string().regex(/^\+?[\d\s()-]{10,}$/, "Valid phone number required"),
  dateOfBirth: z.string().refine((date) => {
    const age = new Date().getFullYear() - new Date(date).getFullYear();
    return age >= 18;
  }, "Must be 18 years or older"),
  gender: z.enum(["Male", "Female", "Other"]),
  occupation: z.string().min(2, "Occupation required"),
  address: z.string().min(5, "Address required"),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  zipCode: z.string().regex(/^[\dA-Za-z\s-]{3,10}$/, "Valid postal code required"),
  country: z.string().min(2, "Country required"),
  maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed"]),
  personalIdNumber: z.string().optional(),
  confidentiality: z.literal(true, { message: "You must confirm this" }),
});

const signinSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
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

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSigninChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSigninData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      // Validate schema
      const validation = signupSchema.safeParse(signupData);
      if (!validation.success) {
        const newErrors: Record<string, string> = {};
        validation.error.errors.forEach((err) => {
          const path = err.path.join(".");
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      // Call signup server function
      const result = await signupServerFn({
        firstName: signupData.firstName!,
        lastName: signupData.lastName!,
        email: signupData.email!,
        password: signupData.password!,
        phone: signupData.phone!,
        dateOfBirth: signupData.dateOfBirth!,
        gender: signupData.gender!,
        occupation: signupData.occupation!,
        address: signupData.address!,
        city: signupData.city!,
        state: signupData.state!,
        zipCode: signupData.zipCode!,
        country: signupData.country!,
        maritalStatus: signupData.maritalStatus!,
        personalIdNumber: signupData.personalIdNumber,
      });

      if (result.success) {
        // Store token
        localStorage.setItem("token", result.token);
        setRefNumber(result.user.refNumber);
        setSuccess(`✅ Registration successful! Reference: ${result.user.refNumber}`);

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate({ to: "/dashboard" });
        }, 2000);
      } else {
        setErrors({ form: result.error || "Registration failed" });
      }
    } catch (error) {
      setErrors({ form: "An error occurred during registration" });
    } finally {
      setLoading(false);
    }
  };

  const handleSigninSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const validation = signinSchema.safeParse(signinData);
      if (!validation.success) {
        const newErrors: Record<string, string> = {};
        validation.error.errors.forEach((err) => {
          const path = err.path.join(".");
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      const result = await signinServerFn({
        email: signinData.email!,
        password: signinData.password!,
      });

      if (result.success) {
        localStorage.setItem("token", result.token);
        setSuccess("✅ Login successful! Redirecting to dashboard...");

        setTimeout(() => {
          navigate({ to: "/dashboard" });
        }, 1500);
      } else {
        setErrors({ form: result.error || "Login failed" });
      }
    } catch (error) {
      setErrors({ form: "An error occurred during login" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-100">
        <div className="pt-8 pb-16 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">🛡️</div>
              <h1 className="text-3xl font-bold text-white font-serif mb-2">
                Official Grant Claim & Identity Verification
              </h1>
              <p className="text-blue-100">Complete all fields accurately. Your information is protected under federal law.</p>
            </div>

            {/* Alerts */}
            {success && (
              <Alert className="mb-6 bg-green-50 border-green-300">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            {errors.form && (
              <Alert className="mb-6 bg-red-50 border-red-300">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{errors.form}</AlertDescription>
              </Alert>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-xl p-8">
              <Tabs defaultValue="signup" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="signup" className="text-lg">
                    New Claimant (Sign Up)
                  </TabsTrigger>
                  <TabsTrigger value="signin" className="text-lg">
                    Existing Claimant (Sign In)
                  </TabsTrigger>
                </TabsList>

                {/* SIGNUP TAB */}
                <TabsContent value="signup">
                  <form onSubmit={handleSignupSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-blue-900 font-semibold">
                          First Name *
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={signupData.firstName || ""}
                          onChange={handleSignupChange}
                          className={errors.firstName ? "border-red-500" : ""}
                          placeholder="John"
                        />
                        {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-blue-900 font-semibold">
                          Last Name *
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={signupData.lastName || ""}
                          onChange={handleSignupChange}
                          className={errors.lastName ? "border-red-500" : ""}
                          placeholder="Doe"
                        />
                        {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="text-blue-900 font-semibold">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={signupData.email || ""}
                          onChange={handleSignupChange}
                          className={errors.email ? "border-red-500" : ""}
                          placeholder="john@example.com"
                        />
                        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-blue-900 font-semibold">
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={signupData.phone || ""}
                          onChange={handleSignupChange}
                          className={errors.phone ? "border-red-500" : ""}
                          placeholder="+1 (555) 123-4567"
                        />
                        {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dateOfBirth" className="text-blue-900 font-semibold">
                          Date of Birth *
                        </Label>
                        <Input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          value={signupData.dateOfBirth || ""}
                          onChange={handleSignupChange}
                          className={errors.dateOfBirth ? "border-red-500" : ""}
                        />
                        {errors.dateOfBirth && <p className="text-red-600 text-sm mt-1">{errors.dateOfBirth}</p>}
                      </div>
                      <div>
                        <Label htmlFor="gender" className="text-blue-900 font-semibold">
                          Gender *
                        </Label>
                        <select
                          id="gender"
                          name="gender"
                          value={signupData.gender || ""}
                          onChange={handleSignupChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.gender && <p className="text-red-600 text-sm mt-1">{errors.gender}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="occupation" className="text-blue-900 font-semibold">
                        Occupation *
                      </Label>
                      <Input
                        id="occupation"
                        name="occupation"
                        value={signupData.occupation || ""}
                        onChange={handleSignupChange}
                        className={errors.occupation ? "border-red-500" : ""}
                        placeholder="Engineer, Teacher, etc."
                      />
                      {errors.occupation && <p className="text-red-600 text-sm mt-1">{errors.occupation}</p>}
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-blue-900 font-semibold">
                        Street Address *
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={signupData.address || ""}
                        onChange={handleSignupChange}
                        className={errors.address ? "border-red-500" : ""}
                        placeholder="123 Main Street"
                      />
                      {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-blue-900 font-semibold">
                          City *
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          value={signupData.city || ""}
                          onChange={handleSignupChange}
                          className={errors.city ? "border-red-500" : ""}
                          placeholder="New York"
                        />
                        {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-blue-900 font-semibold">
                          State/Province *
                        </Label>
                        <Input
                          id="state"
                          name="state"
                          value={signupData.state || ""}
                          onChange={handleSignupChange}
                          className={errors.state ? "border-red-500" : ""}
                          placeholder="NY"
                        />
                        {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
                      </div>
                      <div>
                        <Label htmlFor="zipCode" className="text-blue-900 font-semibold">
                          ZIP/Postal Code *
                        </Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={signupData.zipCode || ""}
                          onChange={handleSignupChange}
                          className={errors.zipCode ? "border-red-500" : ""}
                          placeholder="10001"
                        />
                        {errors.zipCode && <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="country" className="text-blue-900 font-semibold">
                          Country *
                        </Label>
                        <select
                          id="country"
                          name="country"
                          value={signupData.country || ""}
                          onChange={handleSignupChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select Country</option>
                          <option value="USA">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="Mexico">Mexico</option>
                          <option value="Brazil">Brazil</option>
                          <option value="Argentina">Argentina</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.country && <p className="text-red-600 text-sm mt-1">{errors.country}</p>}
                      </div>
                      <div>
                        <Label htmlFor="maritalStatus" className="text-blue-900 font-semibold">
                          Marital Status *
                        </Label>
                        <select
                          id="maritalStatus"
                          name="maritalStatus"
                          value={signupData.maritalStatus || ""}
                          onChange={handleSignupChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select Status</option>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                        </select>
                        {errors.maritalStatus && <p className="text-red-600 text-sm mt-1">{errors.maritalStatus}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="personalIdNumber" className="text-blue-900 font-semibold">
                        Personal ID Number (Optional)
                      </Label>
                      <Input
                        id="personalIdNumber"
                        name="personalIdNumber"
                        value={signupData.personalIdNumber || ""}
                        onChange={handleSignupChange}
                        placeholder="Your Government ID Number"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="password" className="text-blue-900 font-semibold">
                          Password *
                        </Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={signupData.password || ""}
                          onChange={handleSignupChange}
                          className={errors.password ? "border-red-500" : ""}
                          placeholder="••••••••"
                        />
                        {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword" className="text-blue-900 font-semibold">
                          Confirm Password *
                        </Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={signupData.confirmPassword || ""}
                          onChange={(e) => {
                            handleSignupChange(e);
                            if (e.target.value && e.target.value !== signupData.password) {
                              setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
                            } else {
                              setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.confirmPassword;
                                return newErrors;
                              });
                            }
                          }}
                          className={errors.confirmPassword ? "border-red-500" : ""}
                          placeholder="••••••••"
                        />
                        {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="confidentiality"
                          name="confidentiality"
                          checked={signupData.confidentiality || false}
                          onCheckedChange={(checked) => {
                            setSignupData((prev) => ({ ...prev, confidentiality: checked as boolean }));
                            if (checked) {
                              setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.confidentiality;
                                return newErrors;
                              });
                            }
                          }}
                        />
                        <Label htmlFor="confidentiality" className="text-blue-900 font-semibold cursor-pointer">
                          I understand that my winning information must remain confidential *
                        </Label>
                      </div>
                      {errors.confidentiality && <p className="text-red-600 text-sm">{errors.confidentiality}</p>}

                      <p className="text-sm text-red-700 font-semibold">
                        ⚠️ WARNING: Do NOT share your reference number or grant information with anyone. Violation will result in immediate cancellation.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-lg"
                    >
                      {loading ? "Processing..." : "✅ Submit Claim to Federal Database"}
                    </Button>
                  </form>
                </TabsContent>

                {/* SIGNIN TAB */}
                <TabsContent value="signin">
                  <form onSubmit={handleSigninSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="signin-email" className="text-blue-900 font-semibold">
                        Email Address
                      </Label>
                      <Input
                        id="signin-email"
                        name="email"
                        type="email"
                        value={signinData.email || ""}
                        onChange={handleSigninChange}
                        className={errors.email ? "border-red-500" : ""}
                        placeholder="your@email.com"
                      />
                      {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="signin-password" className="text-blue-900 font-semibold">
                        Password
                      </Label>
                      <Input
                        id="signin-password"
                        name="password"
                        type="password"
                        value={signinData.password || ""}
                        onChange={handleSigninChange}
                        className={errors.password ? "border-red-500" : ""}
                        placeholder="••••••••"
                      />
                      {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                      Forgot your password?
                    </a>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-lg"
                    >
                      {loading ? "Signing in..." : "🔑 Sign In to Your Account"}
                    </Button>

                    <div className="relative py-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">or</span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      className="w-full bg-white text-gray-900 border-2 border-gray-300 hover:bg-gray-50 font-bold py-3"
                    >
                      🔐 Sign In with Google
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>

            {/* Reference Number Display */}
            {refNumber && (
              <div className="mt-8 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 text-center">
                <p className="text-gray-700 font-semibold mb-2">Your Reference Number:</p>
                <p className="text-3xl font-bold text-blue-900 font-mono">{refNumber}</p>
                <p className="text-sm text-gray-600 mt-2">Keep this number confidential. You will need it for future correspondence.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      organization: fd.get("organization"),
      contactName: fd.get("contactName"),
      email: fd.get("email"),
      country: fd.get("country"),
      amount: fd.get("amount"),
      summary: fd.get("summary"),
      budget: fd.get("budget"),
      confirm: fd.get("confirm") === "on",
    });

    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    setSubmitting(true);
    // Demo only: nothing is transmitted or stored. Wire this to your backend.
    setTimeout(() => {
      setSubmitting(false);
      setReference(`CGP-${Math.floor(100000 + Math.random() * 899999)}`);
    }, 600);
  }

  if (reference) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-foreground">Application received</h1>
          <p className="mt-3 text-muted-foreground">
            Your reference number is <span className="font-semibold text-foreground">{reference}</span>.
            Keep it for your records. You will receive a written decision by email within six to
            eight weeks, whether or not the application is successful.
          </p>
          <p className="mt-6 rounded-sm border border-border bg-secondary p-4 text-sm text-foreground">
            No payment will ever be requested from you. If anyone contacts you claiming a fee is
            required to release funding, it is not from us.
          </p>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-4 py-14">
        <h1 className="text-3xl font-bold text-foreground">Grant application</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This form is free to submit. This demo does not send or store your data anywhere; it is a
          front-end sample you can connect to your own backend.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
          <Field id="organization" label="Organization or group name" error={errors.organization}>
            <Input id="organization" name="organization" maxLength={120} />
          </Field>
          <Field id="contactName" label="Lead contact name" error={errors.contactName}>
            <Input id="contactName" name="contactName" maxLength={100} />
          </Field>
          <Field id="email" label="Email address" error={errors.email}>
            <Input id="email" name="email" type="email" maxLength={255} />
          </Field>
          <Field id="country" label="Country" error={errors.country}>
            <Input id="country" name="country" maxLength={60} />
          </Field>
          <Field id="amount" label="Amount requested (1,000 - 25,000)" error={errors.amount}>
            <Input id="amount" name="amount" inputMode="numeric" maxLength={7} />
          </Field>
          <Field id="summary" label="Project summary" error={errors.summary}>
            <Textarea id="summary" name="summary" rows={5} maxLength={1500} />
          </Field>
          <Field id="budget" label="Budget breakdown" error={errors.budget}>
            <Textarea id="budget" name="budget" rows={4} maxLength={1500} />
          </Field>

          <div className="flex items-start gap-3 rounded-sm border border-border bg-card p-4">
            <Checkbox id="confirm" name="confirm" className="mt-0.5" />
            <Label htmlFor="confirm" className="text-sm font-normal leading-relaxed">
              I understand this portal is an independent demonstration project, is not a government
              programme, charges no fees, and makes no guarantee of an award.
            </Label>
          </div>
          {errors.confirm && <p className="text-sm text-destructive">{errors.confirm}</p>}

          <Button type="submit" disabled={submitting} className="w-full py-6">
            {submitting ? "Submitting…" : "Submit application"}
          </Button>
        </form>
      </div>
    </SiteLayout>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
