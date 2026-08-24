import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { resetPasswordServerFn } from "@/lib/serverFunctions";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/reset-password" }) as { token?: string };
  const token = search.token || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("This password reset link is missing or invalid.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await resetPasswordServerFn({
        data: {
          token,
          newPassword: password,
        },
      });

      if (result.success) {
        setMessage("Password reset successfully. You can now sign in.");
        setPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          navigate({ to: "/apply", search: { tab: "signin" } });
        }, 1500);
      } else {
        setError(result.error || "Unable to reset your password.");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-slate-900 to-slate-100 px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Abubakri's Grant Portal Demo
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Reset Your Password
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Choose a new password for your demonstration account.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="new-password" className="mb-2 block text-sm font-semibold text-slate-700">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="mb-2 block text-sm font-semibold text-slate-700">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="Enter the password again"
              className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full rounded-lg bg-blue-900 px-4 py-3 font-bold text-white shadow-md transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Updating Password..." : "Reset Password"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate({ to: "/apply" })}
          className="mt-5 w-full text-center text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline"
        >
          ← Back to Sign In
        </button>

        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          Demo project only. This password reset flow is part of a software-development demonstration.
        </p>
      </div>
    </div>
  );
}

