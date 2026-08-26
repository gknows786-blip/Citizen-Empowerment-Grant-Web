import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef, type ReactNode } from "react";
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
  const previousPath = useRef<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => setIsAuthenticated(Boolean(localStorage.getItem("token"))), [location.pathname]);
  useEffect(() => setMobileMenuOpen(false), [location.pathname]);

  useEffect(() => {
    const cameFromApply = previousPath.current === "/apply";
    if (location.pathname === "/dashboard" && cameFromApply && localStorage.getItem("token")) {
      sessionStorage.setItem("grantWelcomePending", "true");
      navigate({ to: "/welcome", replace: true });
    }
    previousPath.current = location.pathname;
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("grantWelcomePending");
    setIsAuthenticated(false);
    setMobileMenuOpen(false);
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <div className="bg-blue-950 px-4 py-1.5 text-center text-xs font-medium text-blue-200 border-b border-blue-900/60 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>U.S. Citizen Grant Portal</span>
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
                U.S. Citizen Grant Program
              </span>
              <span className="block text-[10px] sm:text-[11px] text-blue-200 uppercase tracking-wider font-semibold">
                Communtiy Grant Portal
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
                  className={`rounded-md px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-colors ${isActive ? "bg-amber-400 text-blue-950 shadow-sm font-bold" : "text-blue-100 hover:bg-blue-800 hover:text-white"}`}
                >
                  {item.label}
                </Link>
              );
            })}
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-colors ${location.pathname === "/dashboard" ? "bg-amber-400 text-blue-950 shadow-sm font-bold" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            )}
          </nav>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close main menu" : "Open main menu"}
            aria-expanded={mobileMenuOpen}
            className="relative z-[60] inline-flex md:hidden items-center justify-center min-h-[44px] min-w-[44px] p-2.5 rounded-lg bg-blue-800/80 border border-blue-600/50 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-amber-300" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
        {mobileMenuOpen && (
          <>
            <button
              type="button"
              aria-label="Close menu overlay"
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-x-0 bottom-0 top-[104px] z-30 bg-black/40 md:hidden cursor-default"
            />
            <aside className="fixed top-[104px] right-0 bottom-0 z-40 h-[calc(100dvh-104px)] w-[75vw] overflow-y-auto border-l border-blue-800/80 bg-blue-950 px-4 py-5 shadow-2xl md:hidden">
              <div className="space-y-1">
                {nav.map((item) => {
                  const isActive = location.pathname === item.to;
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${isActive ? "bg-amber-400 text-blue-950 font-bold shadow" : "text-blue-100 hover:bg-blue-900 hover:text-white"}`}
                    >
                      <IconComponent
                        className={`w-5 h-5 ${isActive ? "text-blue-950" : "text-amber-400"}`}
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
                    <span>Open Dashboard</span>
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
            </aside>
          </>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t-4 border-blue-950 bg-slate-900 text-white mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Column 1: About & Direct Contact Info */}
            <div>
              <h3 className="font-serif text-base font-bold text-amber-400 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                <span>About The Program</span>
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                The U.S. Federal Citizen Grant Program provides direct economic support and empowerment funds to eligible individuals and families nationwide.
              </p>
              <div className="space-y-2 text-slate-300 text-xs sm:text-sm border-t border-slate-800 pt-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>6134 Camino Verde Drive, Suite F<br />San Jose, CA 95119</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <a href="tel:4084650399" className="hover:text-amber-300 transition">(408) 465-0399</a>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="font-serif text-base font-bold text-amber-400 mb-3">Quick Links</h3>
              <ul className="text-slate-300 text-xs sm:text-sm space-y-2">
                <li><Link to="/" className="hover:text-amber-300 transition">Home</Link></li>
                <li><Link to="/eligibility" className="hover:text-amber-300 transition">Check Eligibility</Link></li>
                <li><Link to="/apply" search={{ tab: "signup" }} className="hover:text-amber-300 transition">Apply / Sign In</Link></li>
                <li><Link to="/faq" className="hover:text-amber-300 transition">Frequently Asked Questions</Link></li>
              </ul>
            </div>

            {/* Column 3: Compliance & Security */}
            <div>
              <h3 className="font-serif text-base font-bold text-amber-400 mb-3">Compliance & Security</h3>
              <ul className="text-slate-300 text-xs sm:text-sm space-y-2">
                <li className="flex items-center gap-2"><Lock className="w-4 h-4 text-emerald-400 shrink-0" /><span>256-bit SSL Data Encryption</span></li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /><span>Federal Treasury Verified</span></li>
                <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /><span>PCI-DSS Secured Transaction Protocol</span></li>
                <li className="flex items-center gap-2"><Scale className="w-4 h-4 text-emerald-400 shrink-0" /><span>Congressional Act Standard Compliance</span></li>
              </ul>
            </div>

            {/* Column 4: Reach Out Today Form */}
            <div>
              <h3 className="font-serif text-base font-bold text-amber-400 mb-3">Reach Out Today</h3>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  />
                  <input 
                    type="text" 
                    placeholder="Last Name" 
                    className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
                <textarea 
                  rows={3} 
                  placeholder="Your Message" 
                  className="w-full px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 resize-none"
                />
                <button 
                  type="submit" 
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded transition duration-200"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
          <hr className="border-slate-800 mb-6" />
          <div className="text-center text-slate-400 text-xs">
            <p className="mb-2">&copy; {new Date().getFullYear()} U.S. Citizen Grant Portal. All rights reserved.</p>
            <p className="text-slate-400 text-[11px]">official U.S. government platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
}