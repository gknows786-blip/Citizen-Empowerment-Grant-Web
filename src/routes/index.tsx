import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle,
  Users,
  TrendingUp,
  AlertCircle,
  Clock,
  Star,
  User,
  ArrowRight,
  Award,
  Building,
  Sparkles,
  FileText,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "U.S. Federal Citizen Grant & Empowerment Program" },
      {
        name: "description",
        content:
          "Official U.S. Federal Citizen Grant Program. Claim your approved federal grant allocation today. No repayment required.",
      },
    ],
  }),
  component: Home,
});

function UnifiedHeroSection() {
  const [timeLeft, setTimeLeft] = useState("47:59:59");
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiryTime = new Date(now + 48 * 60 * 60 * 1000).getTime();
      const distance = expiryTime - now;
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <section className="relative overflow-hidden border-b border-blue-900 bg-slate-950 text-white">
      <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-white to-blue-600" />
      <div className="relative overflow-hidden border-b border-amber-400/20 bg-gradient-to-r from-red-950 via-red-900 to-red-950 py-2.5 shadow-inner">
        <div className="animate-marquee whitespace-nowrap text-xs sm:text-sm font-semibold tracking-wide text-white">
          <div className="inline-flex items-center gap-8 px-4">
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-300 animate-pulse" />
              <span>Federal Grant Claim Active Allocation Window Expires In:</span>
              <span className="font-mono font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded border border-amber-400/40">
                {timeLeft}
              </span>
            </span>
            <span className="text-amber-400/70">&bull;</span>
            <span className="inline-flex items-center gap-1.5 text-blue-100">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>
                Congressional Citizen Grant Allocation Act Active &bull; Section 402 Federal
                Disbursal
              </span>
            </span>
            <span className="text-amber-400/70">&bull;</span>
            <span className="inline-flex items-center gap-1.5 text-amber-200">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>2,847+ Approved Beneficiary Packages Dispatched via Insured Courier</span>
            </span>
            <span className="text-amber-400/70">&bull;</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-200">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>100% Non-Repayable Federal Funds &bull; No Collateral or Loan Requirement</span>
            </span>
          </div>
          <div className="inline-flex items-center gap-8 px-4">
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-300 animate-pulse" />
              <span>Federal Grant Claim Active Allocation Window Expires In:</span>
              <span className="font-mono font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded border border-amber-400/40">
                {timeLeft}
              </span>
            </span>
            <span className="text-amber-400/70">&bull;</span>
            <span className="inline-flex items-center gap-1.5 text-blue-100">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>
                Congressional Citizen Grant Allocation Act Active &bull; Section 402 Federal
                Disbursal
              </span>
            </span>
            <span className="text-amber-400/70">&bull;</span>
            <span className="inline-flex items-center gap-1.5 text-amber-200">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>2,847+ Approved Beneficiary Packages Dispatched via Insured Courier</span>
            </span>
            <span className="text-amber-400/70">&bull;</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-200">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>100% Non-Repayable Federal Funds &bull; No Collateral or Loan Requirement</span>
            </span>
          </div>
        </div>
      </div>
      <div
        className="relative bg-cover bg-center bg-no-repeat py-14 sm:py-20 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(10, 22, 48, 0.93) 0%, rgba(15, 23, 42, 0.88) 50%, rgba(10, 15, 30, 0.98) 100%), url('https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=2000&q=85')`,
        }}
      >
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-4 flex flex-col items-center">
            <div className="inline-flex p-2.5 rounded-full bg-blue-900/80 ring-2 ring-amber-400/50 text-amber-400 mb-2.5 shadow-xl backdrop-blur-sm">
              <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white drop-shadow-md">
              U.S. Federal Citizen Grant &amp; Empowerment Program For Americans
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-blue-200 font-medium max-w-xl">
              Official Economic Assistance &bull; Verified Federal Grant Disbursement
            </p>
          </div>
          <div className="my-5 max-w-2xl mx-auto rounded-2xl bg-blue-950/60 border border-blue-400/30 p-5 sm:p-7 backdrop-blur-md shadow-2xl">
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-amber-300 tracking-tight drop-shadow-md">
              CLAIM YOUR GRANT
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-blue-100 max-w-lg mx-auto leading-relaxed">
              Approved federal economic funding for qualified citizens &bull;{" "}
              <span className="text-amber-300 font-bold">
                No Repayment Required &bull; Zero Collateral
              </span>
            </p>
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/apply" search={{ tab: "signup" }} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-sm sm:text-base font-bold shadow-lg flex items-center justify-center gap-2 border border-emerald-400/40"
                >
                  <span>CLAIM YOUR ALLOCATION NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/eligibility" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-blue-400/50 bg-blue-900/40 text-blue-100 hover:bg-blue-900/80 px-5 py-3 text-sm font-semibold backdrop-blur-sm"
                >
                  <FileText className="w-4 h-4 mr-1.5 text-amber-400" />
                  <span>Check Eligibility</span>
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-slate-300 pt-2">
            <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-black/30 border border-white/5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Non-Repayable Grant</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-black/30 border border-white/5">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Insured Armored Courier Dispatch</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-black/30 border border-white/5">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Instant Unique Reference Code</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoBoxes() {
  const boxes = [
    {
      title: "What is This Program?",
      icon: <ShieldCheck className="w-10 h-10 text-blue-900" />,
      content:
        "Federal citizen economic empowerment initiative designed to provide direct stimulus and grants to qualified residents. Not a loan — 100% grant funding.",
    },
    {
      title: "How It Works",
      icon: <CheckCircle className="w-10 h-10 text-emerald-600" />,
      content:
        "Step 1: Fill the application claim form\nStep 2: Instant reference number generation\nStep 3: Choose your approved grant tier\nStep 4: Receive funds via insured courier (UPS/FedEx)",
    },
    {
      title: "Eligibility Criteria",
      icon: <Users className="w-10 h-10 text-indigo-600" />,
      content:
        "Resident of participating country • Age 18+ • Valid personal identification • Simple online application process.",
    },
    {
      title: "Program Benefits",
      icon: <TrendingUp className="w-10 h-10 text-amber-600" />,
      content:
        "Up to $200,000 in federal grant funding • Insured home delivery • Full federal protection & verification • Expedited dispatch.",
    },
  ];
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8 sm:py-16">
  <div className="grid grid-cols-2 gap-3 sm:gap-8">
    {boxes.map((box, idx) => (
  <div
    key={idx}
    className={`bg-white border border-slate-200 rounded-xl p-3 sm:p-8 shadow-sm hover:shadow-md transition flex flex-col justify-between ${
      idx > 1 ? "hidden sm:flex" : ""
    }`}
  >
    <div>
      <div className="mb-2 sm:mb-4 [&>svg]:w-7 [&>svg]:h-7 sm:[&>svg]:w-10 sm:[&>svg]:h-10">
        {box.icon}
      </div>

      <h3 className="text-sm sm:text-2xl font-bold text-blue-950 mb-2 sm:mb-3 font-serif leading-tight">
        {box.title}
      </h3>

      <p className="text-slate-600 text-[11px] sm:text-base leading-5 sm:leading-relaxed whitespace-pre-line">
        {box.content}
      </p>
    </div>
  </div>
))}
  </div>
</div>
  );
}

function ImportantNotice() {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-600 p-6 max-w-7xl mx-auto my-4 rounded-r-xl shadow-sm px-4 sm:px-6">
      <div className="flex items-start gap-4">
        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={24} />
        <div>
          <h3 className="font-bold text-amber-950 text-base sm:text-lg mb-1">
            CONFIDENTIALITY &amp; SECURITY PROTOCOL
          </h3>
          <p className="text-amber-900 text-xs sm:text-sm leading-relaxed">
            Please keep your application reference number confidential. Do not share your login
            credentials or reference codes with third parties to prevent claim interception.
          </p>
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  const testimonials = [
    {
      name: "Sarah J.",
      state: "Ohio",
      amount: "$50,000",
      text: "I was skeptical at first, but following the steps on the dashboard, my package arrived securely. This program was a huge relief for our family.",
    },
    {
      name: "Michael R.",
      state: "Texas",
      amount: "$100,000",
      text: "The portal made registration straightforward. Kept track of my reference number and received notification promptly once verified.",
    },
    {
      name: "Jennifer L.",
      state: "California",
      amount: "$75,000",
      text: "Excellent initiative. Simple online form and the customer support answered all my inquiries promptly.",
    },
    {
      name: "David M.",
      state: "Florida",
      amount: "$200,000",
      text: "Selected the Diamond package tier and everything was processed through the official clearing system smoothly.",
    },
  ];
  return (
    <div className="bg-slate-100 py-16 px-4 sm:px-6 border-y border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-blue-950">
            Beneficiary Testimonials
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Verified feedback from grant recipients across participating states
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200 flex min-w-0 flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold shrink-0">
                    <User className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-blue-950 text-xs sm:text-sm truncate">
                      {testimonial.name}
                    </p>
                    <p className="text-[11px] sm:text-xs text-slate-500">{testimonial.state}</p>
                  </div>
                </div>
                <div className="flex text-amber-400 gap-0.5 mb-2.5 sm:mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-[11px] sm:text-sm italic leading-[1.55] sm:leading-relaxed mb-3 sm:mb-4 break-words">
                  &quot;{testimonial.text}&quot;
                </p>
              </div>
              <div className="pt-2.5 sm:pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase text-slate-400">
                  Awarded
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-emerald-700 whitespace-nowrap">
                  {testimonial.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Statistics() {
  const stats = [
    { number: "2,847+", label: "Beneficiaries Enrolled" },
    { number: "$847M+", label: "Total Federal Funds Allocated" },
    { number: "99.8%", label: "Verification Accuracy Rate" },
    { number: "24-48 Hrs", label: "Average Dispatch Window" },
  ];
  return (
      <div className="bg-blue-950 text-white py-8 px-4 sm:px-6">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-2xl sm:text-4xl font-bold text-center mb-5 font-serif text-slate-100">
      Program Distribution Metrics
    </h2>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="p-3 rounded-xl bg-blue-900/40 border border-blue-800/60"
        >
          <div className="text-3xl sm:text-5xl font-extrabold text-amber-400 font-serif mb-1">
            {stat.number}
          </div>

          <div className="text-xs sm:text-sm text-blue-200">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
  );
}

function CallToAction() {
  return (
    <div className="bg-gradient-to-r from-blue-900 to-indigo-900 py-16 px-4 sm:px-6 text-center text-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold font-serif mb-4">
          Ready to Claim Your Federal Allocation?
        </h2>
        <p className="text-blue-200 text-sm sm:text-base mb-8">
          Join thousands of citizens receiving approved grants today. Simple, direct, and fully
          secure.
        </p>
        <Link to="/apply" search={{ tab: "signup" }}>
          <Button
            size="lg"
            className="bg-amber-400 hover:bg-amber-500 text-blue-950 font-bold px-8 py-6 text-base sm:text-lg shadow-xl"
          >
            <span>START YOUR APPLICATION NOW</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

function Home() {
  return (
    <SiteLayout>
      <UnifiedHeroSection />
      <InfoBoxes />
      <ImportantNotice />
      <Testimonials />
      <Statistics />
      <CallToAction />
    </SiteLayout>
  );
}
