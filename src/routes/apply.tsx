import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
import { AlertCircle, CheckCircle } from "lucide-react";

import {
  signupServerFn,
  signinServerFn,
} from "@/lib/serverFunctions";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      {
        title: "Grant Application Demo",
      },
      {
        name: "description",
        content:
          "Independent grant application demonstration portal.",
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
    phone: z
      .string()
      .regex(
        /^\+?[\d\s()-]{10,}$/,
        "Enter a valid phone number",
      ),
    dateOfBirth: z.string().refine(
      (date) => {
        if (!date) return false;

        const birthDate = new Date(date);

        if (Number.isNaN(birthDate.getTime())) {
          return false;
        }

        const today = new Date();

        let age =
          today.getFullYear() - birthDate.getFullYear();

        const monthDifference =
          today.getMonth() - birthDate.getMonth();

        if (
          monthDifference < 0 ||
          (monthDifference === 0 &&
            today.getDate() < birthDate.getDate())
        ) {
          age--;
        }

        return age >= 18;
      },
      "Applicant must be 18 years or older",
    ),
    gender: z.enum(["Male", "Female", "Other"]),
    occupation: z.string().min(2, "Occupation is required"),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z
      .string()
      .regex(
        /^[\dA-Za-z\s-]{3,10}$/,
        "Enter a valid postal code",
      ),
    country: z.string().min(2, "Country is required"),
    maritalStatus: z.enum([
      "Single",
      "Married",
      "Divorced",
      "Widowed",
    ]),
    confidentiality: z.literal(true, {
      message: "You must accept the demonstration terms",
    }),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    },
  );

const signinSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignupData = z.infer<typeof signupSchema>;
type SigninData = z.infer<typeof signinSchema>;

function Apply() {
  const navigate = useNavigate();

  const [signupData, setSignupData] =
    useState<Partial<SignupData>>({});

  const [signinData, setSigninData] =
    useState<Partial<SigninData>>({});

  const [errors, setErrors] =
    useState<Record<string, string>>({});

  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  const [refNumber, setRefNumber] =
    useState<string | null>(null);

  const handleSignupChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
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

  const handleSigninChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
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

  const handleSignupSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setErrors({});
    setSuccess("");
    setLoading(true);

    try {
      const validation =
        signupSchema.safeParse(signupData);

      if (!validation.success) {
        const nextErrors: Record<string, string> = {};

        validation.error.issues.forEach((issue) => {
          const path = issue.path.join(".");

          if (!nextErrors[path]) {
            nextErrors[path] = issue.message;
          }
        });

        setErrors(nextErrors);
        return;
      }

      const result = await signupServerFn({
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
      });

      if (result.success) {
        localStorage.setItem("token", result.token);

        setRefNumber(result.user.refNumber);

        setSuccess(
          `Registration successful. Reference: ${result.user.refNumber}`,
        );

        setTimeout(() => {
          navigate({
            to: "/dashboard",
          });
        }, 2000);
      } else {
        setErrors({
          form:
            result.error ||
            "Registration could not be completed.",
        });
      }
    } catch {
      setErrors({
        form:
          "Unable to connect to the application server.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSigninSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setErrors({});
    setSuccess("");
    setLoading(true);

    try {
      const validation =
        signinSchema.safeParse(signinData);

      if (!validation.success) {
        const nextErrors: Record<string, string> = {};

        validation.error.issues.forEach((issue) => {
          const path = issue.path.join(".");

          if (!nextErrors[path]) {
            nextErrors[path] = issue.message;
          }
        });

        setErrors(nextErrors);
        return;
      }

      const result = await signinServerFn({
        email: validation.data.email,
        password: validation.data.password,
      });

      if (result.success) {
        localStorage.setItem("token", result.token);

        setSuccess(
          "Login successful. Redirecting to your dashboard...",
        );

        setTimeout(() => {
          navigate({
            to: "/dashboard",
          });
        }, 1500);
      } else {
        setErrors({
          form: result.error || "Login failed.",
        });
      }
    } catch {
      setErrors({
        form:
          "Unable to connect to the application server.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-100">
        <div className="px-4 py-10">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <div className="mb-3 text-4xl">📋</div>

              <h1 className="mb-3 font-serif text-3xl font-bold text-white">
                Grant Application Portal
              </h1>

              <p className="text-blue-100">
                Independent demonstration project
              </p>
            </div>

            <Alert className="mb-6 border-yellow-300 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />

              <AlertDescription className="text-yellow-800">
                This website is an independent demonstration project.
                It is not a U.S. government website, does not guarantee
                funding, and does not charge application fees.
              </AlertDescription>
            </Alert>

            {success && (
              <Alert className="mb-6 border-green-300 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />

                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {errors.form && (
              <Alert className="mb-6 border-red-300 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />

                <AlertDescription className="text-red-800">
                  {errors.form}
                </AlertDescription>
              </Alert>
            )}

            <div className="rounded-lg bg-white p-8 shadow-xl">
              <Tabs
                defaultValue="signup"
                className="w-full"
              >
                <TabsList className="mb-8 grid w-full grid-cols-2">
                  <TabsTrigger value="signup">
                    Create Account
                  </TabsTrigger>

                  <TabsTrigger value="signin">
                    Sign In
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signup">
                  <form
                    onSubmit={handleSignupSubmit}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        id="firstName"
                        name="firstName"
                        label="First Name"
                        value={signupData.firstName || ""}
                        error={errors.firstName}
                        onChange={handleSignupChange}
                      />

                      <FormField
                        id="lastName"
                        name="lastName"
                        label="Last Name"
                        value={signupData.lastName || ""}
                        error={errors.lastName}
                        onChange={handleSignupChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        id="email"
                        name="email"
                        type="email"
                        label="Email Address"
                        value={signupData.email || ""}
                        error={errors.email}
                        onChange={handleSignupChange}
                      />

                      <FormField
                        id="phone"
                        name="phone"
                        label="Phone Number"
                        value={signupData.phone || ""}
                        error={errors.phone}
                        onChange={handleSignupChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        label="Date of Birth"
                        value={signupData.dateOfBirth || ""}
                        error={errors.dateOfBirth}
                        onChange={handleSignupChange}
                      />

                      <div>
                        <Label
                          htmlFor="gender"
                          className="font-semibold text-blue-900"
                        >
                          Gender
                        </Label>

                        <select
                          id="gender"
                          name="gender"
                          value={signupData.gender || ""}
                          onChange={handleSignupChange}
                          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
                        >
                          <option value="">
                            Select Gender
                          </option>

                          <option value="Male">Male</option>
                          <option value="Female">
                            Female
                          </option>
                          <option value="Other">Other</option>
                        </select>

                        {errors.gender && (
                          <ErrorText>
                            {errors.gender}
                          </ErrorText>
                        )}
                      </div>
                    </div>

                    <FormField
                      id="occupation"
                      name="occupation"
                      label="Occupation"
                      value={signupData.occupation || ""}
                      error={errors.occupation}
                      onChange={handleSignupChange}
                    />

                    <FormField
                      id="address"
                      name="address"
                      label="Address"
                      value={signupData.address || ""}
                      error={errors.address}
                      onChange={handleSignupChange}
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <FormField
                        id="city"
                        name="city"
                        label="City"
                        value={signupData.city || ""}
                        error={errors.city}
                        onChange={handleSignupChange}
                      />

                      <FormField
                        id="state"
                        name="state"
                        label="State / Province"
                        value={signupData.state || ""}
                        error={errors.state}
                        onChange={handleSignupChange}
                      />

                      <FormField
                        id="zipCode"
                        name="zipCode"
                        label="Postal Code"
                        value={signupData.zipCode || ""}
                        error={errors.zipCode}
                        onChange={handleSignupChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <Label
                          htmlFor="country"
                          className="font-semibold text-blue-900"
                        >
                          Country
                        </Label>

                        <select
                          id="country"
                          name="country"
                          value={signupData.country || ""}
                          onChange={handleSignupChange}
                          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
                        >
                          <option value="">
                            Select Country
                          </option>
                          <option value="USA">
                            United States
                          </option>
                          <option value="Canada">
                            Canada
                          </option>
                          <option value="Mexico">
                            Mexico
                          </option>
                          <option value="Nigeria">
                            Nigeria
                          </option>
                          <option value="Other">
                            Other
                          </option>
                        </select>

                        {errors.country && (
                          <ErrorText>
                            {errors.country}
                          </ErrorText>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="maritalStatus"
                          className="font-semibold text-blue-900"
                        >
                          Marital Status
                        </Label>

                        <select
                          id="maritalStatus"
                          name="maritalStatus"
                          value={
                            signupData.maritalStatus || ""
                          }
                          onChange={handleSignupChange}
                          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
                        >
                          <option value="">
                            Select Status
                          </option>

                          <option value="Single">
                            Single
                          </option>

                          <option value="Married">
                            Married
                          </option>

                          <option value="Divorced">
                            Divorced
                          </option>

                          <option value="Widowed">
                            Widowed
                          </option>
                        </select>

                        {errors.maritalStatus && (
                          <ErrorText>
                            {errors.maritalStatus}
                          </ErrorText>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        id="password"
                        name="password"
                        type="password"
                        label="Password"
                        value={signupData.password || ""}
                        error={errors.password}
                        onChange={handleSignupChange}
                      />

                      <FormField
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        label="Confirm Password"
                        value={
                          signupData.confirmPassword || ""
                        }
                        error={errors.confirmPassword}
                        onChange={handleSignupChange}
                      />
                    </div>

                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="confidentiality"
                          checked={
                            signupData.confidentiality === true
                          }
                          onCheckedChange={(checked) => {
                            setSignupData((previous) => ({
                              ...previous,
                              confidentiality:
                                checked === true,
                            }));
                          }}
                        />

                        <Label
                          htmlFor="confidentiality"
                          className="cursor-pointer text-sm leading-relaxed text-blue-900"
                        >
                          I understand that this is an independent
                          demonstration project and that submitting
                          this form does not guarantee funding.
                        </Label>
                      </div>

                      {errors.confidentiality && (
                        <ErrorText>
                          {errors.confidentiality}
                        </ErrorText>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-green-600 py-3 text-lg font-bold text-white hover:bg-green-700"
                    >
                      {loading
                        ? "Creating Account..."
                        : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signin">
                  <form
                    onSubmit={handleSigninSubmit}
                    className="space-y-6"
                  >
                    <FormField
                      id="signin-email"
                      name="email"
                      type="email"
                      label="Email Address"
                      value={signinData.email || ""}
                      error={errors.email}
                      onChange={handleSigninChange}
                    />

                    <FormField
                      id="signin-password"
                      name="password"
                      type="password"
                      label="Password"
                      value={signinData.password || ""}
                      error={errors.password}
                      onChange={handleSigninChange}
                    />

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 py-3 text-lg font-bold text-white hover:bg-blue-700"
                    >
                      {loading
                        ? "Signing In..."
                        : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>

            {refNumber && (
              <div className="mt-8 rounded-lg border-2 border-green-300 bg-green-50 p-6 text-center">
                <p className="font-semibold text-gray-700">
                  Your application reference:
                </p>

                <p className="mt-2 font-mono text-3xl font-bold text-blue-900">
                  {refNumber}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

function FormField({
  id,
  name,
  label,
  value,
  error,
  type = "text",
  onChange,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  error?: string;
  type?: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
}) {
  return (
    <div>
      <Label
        htmlFor={id}
        className="font-semibold text-blue-900"
      >
        {label}
      </Label>

      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`mt-2 ${
          error ? "border-red-500" : ""
        }`}
      />

      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({
  children,
}: {
  children: string;
}) {
  return (
    <p className="mt-1 text-sm text-red-600">
      {children}
    </p>
  );
}