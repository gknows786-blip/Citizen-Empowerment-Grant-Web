import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { forgotPasswordServerFn } from "../lib/serverFunctions";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const result = await forgotPasswordServerFn({
        data: { email },
      });

      if (result.success) {
        setMessage(
          "If an account exists with this email, a password reset email has been sent."
        );
        setEmail("");
      } else {
        setError(result.error || "Unable to process your request.");
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "#ffffff",
          padding: "32px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            marginBottom: "8px",
            fontSize: "28px",
            fontWeight: 700,
          }}
        >
          Forgot Password?
        </h1>

        <p
          style={{
            color: "#64748b",
            marginBottom: "24px",
            lineHeight: 1.6,
          }}
        >
          Enter your email address and we'll send you instructions to reset
          your password.
        </p>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
            }}
          >
            Email Address
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            autoComplete="email"
            style={{
              width: "100%",
              padding: "13px 14px",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              fontSize: "16px",
              boxSizing: "border-box",
              marginBottom: "16px",
            }}
          />

          {error && (
            <div
              style={{
                padding: "12px",
                marginBottom: "16px",
                borderRadius: "8px",
                background: "#fef2f2",
                color: "#b91c1c",
              }}
            >
              {error}
            </div>
          )}

          {message && (
            <div
              style={{
                padding: "12px",
                marginBottom: "16px",
                borderRadius: "8px",
                background: "#f0fdf4",
                color: "#15803d",
              }}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "8px",
              background: "#1e3a8a",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div
          style={{
            marginTop: "24px",
            textAlign: "center",
          }}
        >
          <Link
            to="/apply" search={{ tab: "signup" }}
            style={{
              color: "#1e3a8a",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
