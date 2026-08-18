import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/eligibility", label: "Eligibility" },
  { to: "/apply", label: "Apply Now" },
  { to: "/faq", label: "FAQ" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isAuthenticated = typeof window !== "undefined" && localStorage.getItem("token");

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Banner */}
      <div className="bg-blue-900 px-4 py-2 text-center text-xs font-medium text-blue-100">
        🛡️ Official U.S. Federal Government Portal - Secure & Verified
      </div>

      {/* Header */}
      <header className="border-b-4 border-blue-900 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white font-serif text-lg font-bold text-blue-900">
              🛡️
            </div>
            <span>
              <span className="block font-serif text-lg font-bold leading-tight text-white">
                U.S. Federal Citizen Grant Program
              </span>
              <span className="block text-xs text-blue-100">
                Official Government Portal
              </span>
            </span>
          </Link>

          <nav className="flex flex-wrap gap-1">
            {nav.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-sm px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white text-blue-900 font-bold"
                      : "text-blue-100 hover:bg-blue-700 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`rounded-sm px-4 py-2 text-sm font-medium transition-colors ${
                  location.pathname === "/dashboard"
                    ? "bg-white text-blue-900 font-bold"
                    : "text-blue-100 hover:bg-blue-700 hover:text-white"
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t-4 border-blue-900 bg-blue-900 text-white mt-auto">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-serif text-lg font-bold text-yellow-400 mb-3">About Us</h3>
              <p className="text-blue-100 text-sm">
                The U.S. Federal Citizen Grant Program is an official government initiative to distribute federal funds to eligible citizens and permanent residents.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-yellow-400 mb-3">Quick Links</h3>
              <ul className="text-blue-100 text-sm space-y-2">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/eligibility" className="hover:text-white">Check Eligibility</Link></li>
                <li><Link to="/apply" className="hover:text-white">Apply Now</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-yellow-400 mb-3">Contact Us</h3>
              <ul className="text-blue-100 text-sm space-y-2">
                <li>📞 (202) 555-0199</li>
                <li>📧 support@usfederalgrant.gov</li>
                <li>📍 100 Independence Ave, Washington DC 20500</li>
                <li>🕐 Mon-Fri, 9 AM - 5 PM EST</li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-yellow-400 mb-3">Security</h3>
              <ul className="text-blue-100 text-sm space-y-2">
                <li>🔒 SSL Encrypted</li>
                <li>✅ Government Verified</li>
                <li>🛡️ PCI DSS Compliant</li>
                <li>⚖️ GDPR Compliant</li>
              </ul>
            </div>
          </div>

          <hr className="border-blue-700 mb-6" />

          <div className="text-center text-blue-100 text-xs">
            <p className="mb-2">
              © {new Date().getFullYear()} U.S. Federal Citizen Grant Program - Official Government Portal
            </p>
            <p>
              This is an official United States government website. | Privacy Policy | Terms & Conditions | Accessibility Statement
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
