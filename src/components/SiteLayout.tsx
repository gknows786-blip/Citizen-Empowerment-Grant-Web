import { Link, useLocation } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  Lock,
  CheckCircle,
  Scale,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/eligibility", label: "Eligibility" },
  { to: "/apply", label: "Apply Now" },
  { to: "/faq", label: "FAQ" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = typeof window !== "undefined" && Boolean(localStorage.getItem("token"));

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      {/* Top Banner */}
      <div className="bg-blue-950 px-4 py-1.5 text-center text-xs font-medium text-blue-200 border-b border-blue-900/60 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>Official U.S. Federal Government Grant Portal &mdash; Secure &amp; Verified</span>
      </div>

      {/* Header */}
      <header className="border-b-4 border-amber-500 bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 text-white shadow-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-800 ring-2 ring-amber-400 shadow text-amber-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-serif text-base sm:text-lg font-bold leading-tight text-white tracking-wide">
                U.S. Federal Citizen Grant Program
              </span>
              <span className="block text-[11px] text-blue-200 uppercase tracking-wider font-semibold">
                Official Government Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {nav.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-md px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-amber-400 text-blue-950 shadow-sm"
                      : "text-blue-100 hover:bg-blue-800 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-colors ${
                  location.pathname === "/dashboard"
                    ? "bg-amber-400 text-blue-950 shadow-sm"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-blue-100 hover:text-white hover:bg-blue-800 rounded-md"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-blue-800 bg-blue-950 px-4 py-3 space-y-1">
            {nav.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-amber-400 text-blue-950 font-bold"
                      : "text-blue-100 hover:bg-blue-800 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            {isAuthenticated && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-700 mt-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>My Grant Dashboard</span>
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t-4 border-blue-950 bg-slate-900 text-white mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-serif text-base font-bold text-amber-400 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                <span>About The Program</span>
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                The U.S. Federal Citizen Grant Program provides direct economic support and empowerment funds to eligible individuals and families nationwide.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-base font-bold text-amber-400 mb-3">Quick Links</h3>
              <ul className="text-slate-300 text-xs sm:text-sm space-y-2">
                <li>
                  <Link to="/" className="hover:text-amber-300 transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/eligibility" className="hover:text-amber-300 transition">
                    Check Eligibility &amp; Scoring
                  </Link>
                </li>
                <li>
                  <Link to="/apply" className="hover:text-amber-300 transition">
                    Apply Now / Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-amber-300 transition">
                    Frequently Asked Questions
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-base font-bold text-amber-400 mb-3">Official Inquiries</h3>
              <ul className="text-slate-300 text-xs sm:text-sm space-y-2.5">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>(202) 555-0199</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>support@usfederalgrant.gov</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>100 Independence Ave, Washington, D.C. 20500</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Mon-Fri, 9:00 AM - 5:00 PM EST</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-base font-bold text-amber-400 mb-3">Compliance &amp; Security</h3>
              <ul className="text-slate-300 text-xs sm:text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>256-bit SSL Data Encryption</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Federal Treasury Verified</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>PCI-DSS Secured Transaction Protocol</span>
                </li>
                <li className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Congressional Act Standard Compliance</span>
                </li>
              </ul>
            </div>
          </div>

          <hr className="border-slate-800 mb-6" />

          <div className="text-center text-slate-400 text-xs">
            <p className="mb-2">
              &copy; {new Date().getFullYear()} U.S. Federal Citizen Grant &amp; Empowerment Portal. All rights reserved.
            </p>
            <p className="text-slate-400 text-[11px]">
              Official Federal Demonstration Portal &bull; Privacy Policy &bull; Terms of Service &bull; Section 508 Accessibility
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
