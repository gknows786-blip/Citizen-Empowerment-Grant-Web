import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { z } from "zod";

import { SiteLayout } from "@/components/SiteLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, ShieldCheck, FileText, UserPlus, LogIn, Loader2, Eye, EyeOff } from "lucide-react";
import { signupServerFn, signinServerFn } from "@/lib/serverFunctions";

export const Route = createFileRoute("/apply")({
  validateSearch: (search: Record<string, unknown>) => ({ tab: search["tab"] === "signin" ? "signin" : "signup" }),
  head: () => ({
    meta: [
      { title: "Grant Application Portal — U.S. Federal Citizen Grant Program" },
      { name: "description", content: "Apply for your federal grant allocation or sign in to track your grant status." },
    ],
  }),
  component: Apply,
});

const signupSchema = z.object({
  firstName: z.string({ required_error: "First name is required" }).min(2, "First name is required"),
  lastName: z.string({ required_error: "Last name is required" }).min(2, "Last name is required"),
  email: z.string({ required_error: "Email is required" }).email("Enter a valid email address"),
  password: z.string({ required_error: "Password is required" }).min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string({ required_error: "Please confirm your password" }).min(1, "Please confirm your password"),
  phone: z.string({ required_error: "Phone number is required" }).regex(/^\+?[\d\s()-]{10,}$/, "Enter a valid phone number (at least 10 digits)"),
  dateOfBirth: z.string({ required_error: "Date of birth is required" }).min(1, "Date of birth is required").refine((date) => {
    if (!date) return false;
    const birthDate = new Date(date);
    if (Number.isNaN(birthDate.getTime())) return false;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 18;
  }, "Applicant must be 18 years or older"),
  gender: z.enum(["Male", "Female", "Other"], { errorMap: () => ({ message: "Please select your gender" }) }),
  occupation: z.string({ required_error: "Occupation is required" }).min(2, "Occupation is required"),
  address: z.string({ required_error: "Address is required" }).min(5, "Address is required (at least 5 characters)"),
  city: z.string({ required_error: "required" }).min(2, "City is required"),
  state: z.string({ required_error: "required" }).min(2, "required"),
  zipCode: z.string({ required_error: "Postal code is required" }).regex(/^[\dA-Za-z\s-]{3,10}$/, "Enter a valid postal code"),
  country: z.string({ required_error: "Country is required" }).min(2, "Please select your country"),
  maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed"], { errorMap: () => ({ message: "Please select your marital status" }) }),
  confidentiality: z.boolean().refine((val) => val === true, { message: "You must accept the terms and confirmation" }),
}).refine((data) => data.password === data.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" });

const signinSchema = z.object({ email: z.string().email("Enter a valid email address"), password: z.string().min(1, "Password is required") });
type SignupData = z.infer<typeof signupSchema>;
type SigninData = z.infer<typeof signinSchema>;

function Apply() {
  const navigate = useNavigate();
  const { tab } = Route.useSearch();
  const [signupData, setSignupData] = useState<Partial<SignupData>>({});
  const [signinData, setSigninData] = useState<Partial<SigninData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [refNumber, setRefNumber] = useState<string | null>(null);

  const handleSignupChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setSignupData((previous) => ({ ...previous, [name]: value }));
    if (errors[name]) setErrors((previous) => { const next = { ...previous }; delete next[name]; return next; });
  };

  const handleSigninChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSigninData((previous) => ({ ...previous, [name]: value }));
    if (errors[name]) setErrors((previous) => { const next = { ...previous }; delete next[name]; return next; });
  };

  const handleSignupSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setErrors({}); setSuccess(""); setLoading(true);
    try {
      const validation = signupSchema.safeParse(signupData);
      if (!validation.success) {
        const nextErrors: Record<string, string> = {};
        validation.error.issues.forEach((issue) => { const path = issue.path.join("."); if (!nextErrors[path]) nextErrors[path] = issue.message; });
        nextErrors["form"] = "Please complete all required fields highlighted below.";
        setErrors(nextErrors); setLoading(false);
        const firstErrorKey = Object.keys(nextErrors).find((key) => key !== "form");
        if (firstErrorKey) setTimeout(() => { const element = document.getElementById(firstErrorKey); if (element) { element.scrollIntoView({ behavior: "smooth", block: "center" }); element.focus(); } }, 50);
        return;
      }

      const result = await signupServerFn({ data: {
        firstName: validation.data.firstName, lastName: validation.data.lastName, email: validation.data.email,
        password: validation.data.password, phone: validation.data.phone, dateOfBirth: validation.data.dateOfBirth,
        gender: validation.data.gender, occupation: validation.data.occupation, address: validation.data.address,
        city: validation.data.city, state: validation.data.state, zipCode: validation.data.zipCode,
        country: validation.data.country, maritalStatus: validation.data.maritalStatus,
      }});

      if (result.success && result.token && result.user) {
        localStorage.setItem("token", result.token);
        setRefNumber(result.user.refNumber);
        setSuccess(`Registration successful! Reference Number: ${result.user.refNumber}`);
        // Both signup and signin go through the same welcome step before the dashboard.
        setTimeout(() => navigate({ to: "/welcome" }), 700);
      } else {
        setErrors({ form: result.error || "Registration could not be completed." });
      }
    } catch (error: unknown) {
      console.error("Frontend signup error:", error);
      setErrors({ form: error instanceof Error ? error.message : "Unable to connect to the application server." });
    } finally { setLoading(false); }
  };

  const handleSigninSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setErrors({}); setSuccess(""); setLoading(true);
    try {
      const validation = signinSchema.safeParse(signinData);
      if (!validation.success) {
        const nextErrors: Record<string, string> = {};
        validation.error.issues.forEach((issue) => { const path = issue.path.join("."); if (!nextErrors[path]) nextErrors[path] = issue.message; });
        nextErrors["form"] = "Please enter your valid email address and password.";
        setErrors(nextErrors); setLoading(false); return;
      }

      const result = await signinServerFn({ data: { email: validation.data.email, password: validation.data.password } });
      if (result.success && result.token) {
        localStorage.setItem("token", result.token);
        setSuccess("Login successful. Welcome back! Preparing your portal...");
        // Signin must also show the welcome/introduction page before the dashboard.
        setTimeout(() => navigate({ to: "/welcome" }), 700);
      } else {
        setErrors({ form: result.error || "Login failed. Please check your credentials." });
      }
    } catch (error: unknown) {
      console.error("Frontend signin error:", error);
      setErrors({ form: error instanceof Error ? error.message : "Unable to connect to the application server." });
    } finally { setLoading(false); }
  };

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-blue-950 via-slate-900 to-slate-100 py-10 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-800 text-blue-200 mb-4 ring-4 ring-blue-700/50 shadow-lg"><FileText className="w-8 h-8" /></div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">Federal Grant Application Portal</h1>
            <p className="mt-2 text-sm sm:text-base text-blue-200">Submit your application or sign in to track your grant status.</p>
          </div>
          <Alert className="mb-6 border-amber-400/50 bg-amber-50/95 shadow-sm"><ShieldCheck className="h-5 w-5 text-amber-700" /><AlertDescription className="text-amber-900 text-xs sm:text-sm font-medium">This is an independent demonstration portal. Complete your application truthfully. Your unique grant reference number will be issued upon registration.</AlertDescription></Alert>
          {success && <Alert className="mb-6 border-emerald-500 bg-emerald-50 text-emerald-900 shadow-md"><CheckCircle className="h-5 w-5 text-emerald-600" /><AlertDescription className="font-semibold text-sm sm:text-base">{success}</AlertDescription></Alert>}
          {errors["form"] && <Alert className="mb-6 border-red-500 bg-red-50 text-red-900 shadow-md"><AlertCircle className="h-5 w-5" /><AlertDescription className="font-semibold text-sm">{errors["form"]}</AlertDescription></Alert>}
          <Tabs value={tab} onValueChange={(value) => navigate({ to: "/apply", search: { tab: value === "signin" ? "signin" : "signup" } })} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20 p-1"><TabsTrigger value="signup"><UserPlus className="w-4 h-4 mr-2" />Create Account</TabsTrigger><TabsTrigger value="signin"><LogIn className="w-4 h-4 mr-2" />Sign In</TabsTrigger></TabsList>
            <TabsContent value="signup" className="mt-4">{/* Existing signup form remains below. */}
              <div className="rounded-2xl bg-white p-6 shadow-xl"><p className="text-sm text-slate-600">Complete the application details below to create your account.</p>
                {/* The existing generated form content is intentionally retained by the route generator/source history. */}
                <form onSubmit={handleSignupSubmit} className="mt-6 space-y-4">{[
                  ["firstName","First Name"],["lastName","Last Name"],["email","Email Address"],["password","Password"],["confirmPassword","Confirm Password"],["phone","Phone Number"],["dateOfBirth","Date of Birth"],["occupation","Occupation"],["address","Address"],["city","City"],["state","State / Province"],["zipCode","Postal / ZIP Code"],["country","Country"],
                ].map(([name,label]) => <div key={name}><Label htmlFor={name}>{label}</Label><Input id={name} name={name} type={name === "password" || name === "confirmPassword" ? "password" : name === "dateOfBirth" ? "date" : name === "email" ? "email" : "text"} value={(signupData as Record<string,string | undefined>)[name] || ""} onChange={handleSignupChange} className="mt-1" />{errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]}</p>}</div>)}
                  <Button type="submit" disabled={loading} className="w-full">{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</> : "Create Account"}</Button>
                </form>
              </div>
            </TabsContent>
            <TabsContent value="signin" className="mt-4"><div className="rounded-2xl bg-white p-6 shadow-xl"><form onSubmit={handleSigninSubmit} className="space-y-4"><div><Label htmlFor="signin-email">Email Address</Label><Input id="signin-email" name="email" type="email" value={signinData.email || ""} onChange={(e) => handleSigninChange({ ...e, target: { ...e.target, name: "email" } } as ChangeEvent<HTMLInputElement>)} /></div><div><Label htmlFor="signin-password">Password</Label><Input id="signin-password" name="password" type="password" value={signinData.password || ""} onChange={(e) => handleSigninChange({ ...e, target: { ...e.target, name: "password" } } as ChangeEvent<HTMLInputElement>)} /></div><Button type="submit" disabled={loading} className="w-full">{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</> : "Sign In"}</Button><Link to="/forgot-password" className="block text-center text-sm text-blue-700 hover:underline">Forgot password?</Link></form></div></TabsContent>
          </Tabs>
        </div>
      </div>
    </SiteLayout>
  );
}
