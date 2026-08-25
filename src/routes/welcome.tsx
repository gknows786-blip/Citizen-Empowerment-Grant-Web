import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, CheckCircle2, ClipboardCheck, FileText, LockKeyhole, ShieldCheck, UserRound, Loader2 } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { getDashboardDataServerFn } from "@/lib/serverFunctions";

export const Route = createFileRoute("/welcome")({
  head: () => ({ meta: [{ title: "Welcome to Your Grant Portal" }, { name: "description", content: "A secure introduction to your grant application dashboard and next steps." }] }),
  component: WelcomePage,
});

function WelcomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ firstName?: string; lastName?: string; refNumber?: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("grantWelcomePending") !== "true") { navigate({ to: "/dashboard", replace: true }); return; }
    const token = localStorage.getItem("token");
    if (!token) { sessionStorage.removeItem("grantWelcomePending"); navigate({ to: "/apply", search: { tab: "signin" }, replace: true }); return; }
    let active = true;
    getDashboardDataServerFn({ data: { token } }).then((result: any) => {
      if (!active) return;
      const profile = result?.user || result?.data?.user || {};
      setUser({ firstName: profile.firstName, lastName: profile.lastName, refNumber: profile.refNumber });
    }).catch(() => {}).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [navigate]);

  const continueToDashboard = () => { sessionStorage.removeItem("grantWelcomePending"); navigate({ to: "/dashboard" }); };
  const firstName = user.firstName || "there";
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return (
    <SiteLayout>
      <main className="min-h-[calc(100vh-180px)] bg-gradient-to-b from-blue-950 via-slate-950 to-slate-100 px-4 py-10 sm:px-6 sm:py-14"><div className="mx-auto max-w-5xl"><section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 px-6 py-10 text-white sm:px-10 sm:py-12"><div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between"><div className="max-w-2xl"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-700/70 bg-blue-900/60 px-3 py-1.5 text-xs font-semibold text-blue-100"><CheckCircle2 className="h-4 w-4 text-emerald-400" />Account successfully secured</div><h1 className="font-serif text-3xl font-bold tracking-tight sm:text-5xl">Welcome, {firstName}.</h1><p className="mt-4 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">Your account is ready. This quick introduction explains what you can do inside your grant portal before you enter your personal dashboard.</p>{fullName && <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-blue-300">Account holder: {fullName}</p>}</div><div className="hidden h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 border-amber-400/80 bg-blue-800 shadow-xl sm:flex"><UserRound className="h-12 w-12 text-amber-300" /></div></div></div>
        <div className="p-6 sm:p-10">
          {loading ? <div className="mb-8 flex items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 py-4 text-sm font-semibold text-blue-900"><Loader2 className="h-4 w-4 animate-spin" />Loading your secure reference...</div> : <div className="mb-8 rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-5 sm:p-6"><div className="flex items-start gap-3"><div className="mt-0.5 rounded-lg bg-emerald-700 p-2 text-white"><ShieldCheck className="h-5 w-5" /></div><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Secure reference code</p><p className="mt-1 break-all font-mono text-xl font-bold tracking-wider text-blue-950 sm:text-2xl">{user.refNumber || "Reference available in your dashboard"}</p><p className="mt-2 text-xs leading-5 text-emerald-800">Keep this reference private. Do not post it publicly or share it with strangers.</p></div></div></div>}
          <div className="grid gap-4 sm:grid-cols-3"><InfoCard icon={<FileText className="h-5 w-5" />} title="Your application" text="Review the information connected to your application and keep your account details up to date." /><InfoCard icon={<ClipboardCheck className="h-5 w-5" />} title="Track progress" text="Use your dashboard to follow application updates, package information, and important notices." /><InfoCard icon={<LockKeyhole className="h-5 w-5" />} title="Protect your details" text="Your account and reference information are personal. Never share your password or secure reference." /></div>
          <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-5 sm:p-6"><div className="flex items-start gap-3"><div className="mt-0.5 rounded-lg bg-blue-900 p-2 text-amber-300"><ShieldCheck className="h-5 w-5" /></div><div><h2 className="font-semibold text-blue-950">What happens next?</h2><p className="mt-1 text-sm leading-6 text-slate-700">Your dashboard is the main place to review your application information, see your current status, and follow the next steps connected to your account.</p></div></div></div>
          <div className="mt-8 flex flex-col items-stretch gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><h2 className="font-serif text-lg font-bold text-slate-900">Ready to continue?</h2><p className="mt-1 text-sm text-slate-600">Open your dashboard to continue.</p></div><button type="button" onClick={continueToDashboard} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-900 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2">Open My Dashboard<ArrowRight className="h-4 w-4" /></button></div>
        </div>
      </section></div></main>
    </SiteLayout>
  );
}

function InfoCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) { return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-3 inline-flex rounded-lg bg-blue-950 p-2 text-amber-300">{icon}</div><h3 className="font-semibold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>; }
