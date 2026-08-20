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

function CountdownTimer() {
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
    <div className="bg-red-700 text-white py-2.5 px-4 text-center font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-inner">
      <Clock className="w-4 h-4 text-amber-300 animate-pulse" />
      <span>Federal Grant Claim Active Allocation Window Expires In:</span>
      <span className="font-mono text-base sm:text-lg bg-red-900/80 px-2.5 py-0.5 rounded border border-red-500/50">
        {timeLeft}
      </span>
    </div>
  );
}

function GovernmentHeader() {
  return (
    <div className="bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white border-b border-blue-800">
      {/* Patriotic Flag Banner */}
      <div className="h-1.5 bg-gradient-to-r from-red-600 via-white to-blue-600"></div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 text-center">
        <div className="inline-flex p-3 rounded-full bg-blue-800 ring-4 ring-amber-400/40 text-amber-400 mb-4 shadow-xl">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold mb-3 font-serif tracking-tight text-white">
          U.S. Federal Citizen Grant &amp; Empowerment Program
        </h1>
        <p className="text-base sm:text-xl text-blue-200 mb-4 font-serif max-w-2xl mx-auto">
          Direct Citizen Empowerment Initiative &bull; Federal Grant Disbursement
        </p>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Official Portal &bull; Verified Federal Assistance Distribution</span>
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <div className="relative bg-gradient-to-b from-blue-950 to-slate-900 py-16 sm:py-24 px-4 text-white overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 bg-amber-400/10 text-amber-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-amber-400/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Congressional Citizen Grant Allocation</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-extrabold mb-4 font-serif text-amber-300 drop-shadow-md">
          CLAIM YOUR GRANT
        </h2>
        <p className="text-xl sm:text-3xl font-semibold text-slate-100 mb-4">
          Direct Economic Assistance &amp; Empowerment For Citizens
        </p>
        <p className="text-base sm:text-xl mb-8 text-blue-200 max-w-2xl mx-auto">
          Approved federal funding distributed to qualified residents.{" "}
          <span className="text-amber-300 font-bold">No Repayment Required &bull; Zero Collateral</span>
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/apply" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-base sm:text-lg font-bold shadow-xl flex items-center justify-center gap-2"
            >
              <span>CLAIM YOUR ALLOCATION NOW</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/eligibility" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-blue-400 text-blue-100 hover:bg-blue-900/60 px-6 py-6 text-base font-semibold"
            >
              <FileText className="w-4 h-4 mr-2" />
              <span>Check Eligibility</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {boxes.map((box, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="mb-4">{box.icon}</div>
              <h3 className="text-xl sm:text-2xl font-bold text-blue-950 mb-3 font-serif">
                {box.title}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
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
            Please keep your application reference number confidential. Do not share your login credentials or reference codes with third parties to prevent claim interception.
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-blue-950 text-sm">{testimonial.name}</p>
                    <p className="text-xs text-slate-500">{testimonial.state}</p>
                  </div>
                </div>

                <div className="flex text-amber-400 gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-slate-600 text-xs sm:text-sm italic leading-relaxed mb-4">
                  "{testimonial.text}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-slate-400">Awarded</span>
                <span className="text-sm font-extrabold text-emerald-700">
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
    <div className="bg-blue-950 text-white py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-4xl font-bold text-center mb-10 font-serif text-slate-100">
          Program Distribution Metrics
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-blue-900/40 border border-blue-800/60">
              <div className="text-3xl sm:text-5xl font-extrabold text-amber-400 font-serif mb-1">
                {stat.number}
              </div>
              <div className="text-xs sm:text-sm text-blue-200">{stat.label}</div>
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
          Join thousands of citizens receiving approved grants today. Simple, direct, and fully secure.
        </p>
        <Link to="/apply">
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
      <GovernmentHeader />
      <CountdownTimer />
      <HeroSection />
      <InfoBoxes />
      <ImportantNotice />
      <Testimonials />
      <Statistics />
      <CallToAction />
    </SiteLayout>
  );
}
