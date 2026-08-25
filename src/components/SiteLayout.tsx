import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
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
  Home,
  FileCheck,
  FileSpreadsheet,
  HelpCircle,
  LogOut,
} from "lucide-react";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/eligibility", label: "Eligibility", icon: FileCheck },
  { to: "/apply", label: "Apply Now", icon: FileSpreadsheet },
  { to: "/faq", label: "FAQ", icon: HelpCircle },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(Boolean(localStorage.getItem("token")));
  }, [location.pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let previousToken = localStorage.getItem("token");

    const checkAuthentication = () => {
      const currentToken = localStorage.getItem("token");

      if (!previousToken && currentToken && location.pathname === "/apply") {
        const alreadyWelcomed = sessionStorage.getItem("grantWelcomeSeen") === "true";

        if (!alreadyWelcomed) {
          navigate({ to: "/welcome", replace: true });
        }
      }

      previousToken = currentToken;
    };

    const interval = window.setInterval(checkAuthentication, 250);

    return () => window.clearInterval(interval);
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("grantWelcomeSeen");
    setIsAuthenticated(false);
    setMobileMenuOpen(false);
    navigate({ to: "/" });
  };

  const handleDemoContact = (type: "phone" | "email") => {
    const message =
      type === "phone"
        ? "This is a demonstration project. The displayed phone number is not a real contact number."
        : "This is a demonstration project. The displayed email address is not a real contact address.";

    window.alert(message);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <div className="bg-blue-950 px-4 py-1.5 text-center text-xs font-medium text-blue-200 border-b border-blue-900/60 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>Official U.S. Federal Government Grant Portal &mdash; Secure &amp; Verified</span>
      </div>

      <header className="relative border-b-4 border-amber-500 bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 text-white shadow-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 hover:opacity-90 transition select-none"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-800 ring-2 ring-amber-400 shadow text-amber-300 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-serif text-sm sm:text-lg font-bold leading-tight text-white tracking-wide">
                U.S. Federal Citizen Grant Program
              </span>
              <span className="block text-[10px] sm:text-[11px] text-blue-200 uppercase tracking-wider font-semibold">
                Official Government Portal
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1.5">
            {nav.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-md px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-amber-400 text-blue-950 shadow-sm font-bold"
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
                    ? "bg-amber-400 text-blue-950 shadow-sm font-bold"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            )}
          </nav>

          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close main menu" : "Open main menu"}
              aria-expanded={mobileMenuOpen}
              className="relative inline-flex items-center justify-center min-h-[44px] min-w-[44px] p-2.5 rounded-lg bg-blue-800/80 border border-blue-600/50 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-amber-300" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <aside className="absolute top-full right-0 z-40 h-[calc(100dvh-7rem)] w-[75vw] max-w-none overflow-y-auto border-l border-blue-800/80 bg-blue-950 px-4 py-5 shadow-2xl animate-in slide-in-from-right duration-200 md:hidden">
            <div>
              <div className="space-y-1">
                {nav.map((item) => {
                  const isActive = location.pathname === item.to;
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-amber-400 text-blue-950 font-bold shadow"
                          : "text-blue-100 hover:bg-blue-900 hover:text-white"
                      }`}
                    >
                      <IconComponent
                        className={`w-5 h-5 ${
                          isActive ? "text-blue-950" : "text-amber-400"
                        }`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {isAuthenticated ? (
                <div className="pt-4 mt-3 border-t border-blue-800/60 space-y-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 shadow"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Open My Grant Dashboard</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-400/40 bg-red-950/40 px-4 py-2.5 text-xs font-semibold text-red-300 hover:bg-red-900/50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 mt-3 border-t border-blue-800/60">
                  <Link
                    to="/apply"
                    search={{ tab: "signup" }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-lg bg-amber-400 px-4 py-3 text-sm font-bold text-blue-950 hover:bg-amber-500 shadow"
                  >
                    <FileSpreadsheet className="w-5 h-5" />
                    <span>Start Application / Sign In</span>
                  </Link>
                </div>
              )}
            </div>
          </aside>
        )}
      </header>

      <main className="flex-1">{children}</main>

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
                <li><Link to="/" className="hover:text-amber-300 transition">Home</Link></li>
                <li><Link to="/eligibility" className="hover:text-amber-300 transition">Check Eligibility &amp; Scoring</Link></li>
                <li><Link to="/apply" search={{ tab: "signup" }} className="hover:text-amber-300 transition">Apply Now / Sign In</Link></li>
                <li><Link to="/faq" className="hover:text-amber-300 transition">Frequently Asked Questions</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-base font-bold text-amber-400 mb-3">Official Inquiries</h3>
              <ul className="text-slate-300 text-xs sm:text-sm space-y-2.5">
                <li>
                  <button type="button" onClick={() => handleDemoContact("phone")} className="flex items-center gap-2 text-left hover:text-amber-300 transition">
                    <Phone className="w-4 h-4 text-amber-400 shrink-0" /><span>(202) 555-0199</span>
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleDemoContact("email")} className="flex items-center gap-2 text-left hover:text-amber-300 transition">
                    <Mail className="w-4 h-4 text-amber-400 shrink-0" /><span>support@usfederalgrant.gov</span>
                  </button>
                </li>
                <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /><span>100 Independence Ave, Washington, D.C. 20500</span></li>
                <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-400 shrink-0" /><span>Mon-Fri, 9:00 AM - 5:00 PM EST</span></li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-base font-bold text-amber-400 mb-3">Compliance &amp; Security</h3>
              <ul className="text-slate-300 text-xs sm:text-sm space-y-2">
                <li className="flex items-center gap-2"><Lock className="w-4 h-4 text-emerald-400 shrink-0" /><span>256-bit SSL Data Encryption</span></li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /><span>Federal Treasury Verified</span></li>
                <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /><span>PCI-DSS Secured Transaction Protocol</span></li>
                <li className="flex items-center gap-2"><Scale className="w-4 h-4 text-emerald-400 shrink-0" /><span>Congressional Act Standard Compliance</span></li>
              </ul>
            </div>
          </div>

          <hr className="border-slate-800 mb-6" />

          <div className="text-center text-slate-400 text-xs">
            <p className="mb-2">&copy; {new Date().getFullYear()} U.S. Federal Citizen Grant &amp; Empowerment Portal. All rights reserved.</p>
            <p className="text-slate-400 text-[11px]">Official Federal Demonstration Portal &bull; Privacy Policy &bull; Terms of Service &bull; Section 508 Accessibility</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
