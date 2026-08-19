import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Shield, CheckCircle, Users, TrendingUp, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "U.S. Federal Citizen Grant & Empowerment Program" },
      {
        name: "description",
        content:
          "Official U.S. Government Citizen Grant Program. Congratulations! You have been selected to receive a federal grant. No repayment required.",
      },
      { property: "og:title", content: "U.S. Federal Citizen Grant & Empowerment Program" },
      {
        property: "og:description",
        content: "Official government grant program offering free money to American citizens.",
      },
    ],
  }),
  component: Home,
});

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState("48:00:00");

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
    <div className="bg-red-600 text-white py-4 px-4 text-center font-bold text-lg">
      ⏰ Your grant expires in: <span className="font-mono text-2xl">{timeLeft}</span>
    </div>
  );
}

function GovernmentHeader() {
  return (
    <div className="bg-gradient-to-b from-blue-900 to-blue-800 text-white">
      {/* Flag Banner */}
      <div className="h-2 bg-gradient-to-r from-red-600 via-white to-blue-600"></div>

      {/* Header Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="mb-4 text-4xl">🛡️</div>
        <h1 className="text-4xl font-bold mb-2 font-serif">
          U.S. Federal Citizen Grant & Empowerment Program
        </h1>
        <p className="text-xl text-blue-100 mb-4 font-serif">
          Official Government Initiative for American Communities
        </p>
        <div className="flex items-center justify-center gap-2 text-green-300 font-semibold">
          <CheckCircle size={20} />
          Official Website of the United States Government
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <div
      className="relative bg-cover bg-center py-16 px-4"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400"><rect fill="%23f5f5f5" width="1200" height="400"/></svg>\')',
      }}
    >
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-5xl font-bold mb-4 font-serif drop-shadow-lg">CONGRATULATIONS!</h2>
        <p className="text-3xl mb-2 font-semibold drop-shadow-md">
          You Have Been Selected to Receive a Federal Grant
        </p>
        <p className="text-2xl mb-8 font-serif drop-shadow-md">
          The U.S. Government is empowering citizens with{" "}
          <span className="text-yellow-300 font-bold">FREE MONEY</span> — No Repayment Required
        </p>
        <Link to="/apply">
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-bold"
          >
            CHECK YOUR ELIGIBILITY
          </Button>
        </Link>
      </div>
    </div>
  );
}

function InfoBoxes() {
  const boxes = [
    {
      title: "What is This Program?",
      icon: <Shield className="w-12 h-12 text-blue-600" />,
      content:
        "Federal government helping citizens with economic empowerment. Not a loan — Grant money. Approved by Congress.",
    },
    {
      title: "How It Works",
      icon: <CheckCircle className="w-12 h-12 text-green-600" />,
      content:
        "Step 1: Fill the claim form\nStep 2: Verify your identity\nStep 3: Receive cash via UPS/FedEx\nStep 4: Enjoy your winnings!",
    },
    {
      title: "Eligibility",
      icon: <Users className="w-12 h-12 text-purple-600" />,
      content:
        "Must be a resident of any American country • Age 18+ • Valid government ID • Simple online application",
    },
    {
      title: "Benefits",
      icon: <TrendingUp className="w-12 h-12 text-orange-600" />,
      content:
        "Up to $200,000 grant • Secure home delivery • Federal insurance protection • Fast processing",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {boxes.map((box, idx) => (
          <div
            key={idx}
            className="bg-white border-2 border-gray-300 rounded-lg p-8 shadow-lg hover:shadow-xl transition"
          >
            <div className="mb-4">{box.icon}</div>
            <h3 className="text-2xl font-bold text-blue-900 mb-4 font-serif">{box.title}</h3>
            <p className="text-gray-700 whitespace-pre-line">{box.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImportantNotice() {
  return (
    <div className="bg-red-100 border-l-4 border-red-600 p-6 m-4 max-w-7xl mx-auto my-8 rounded">
      <div className="flex items-start gap-4">
        <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
        <div>
          <h3 className="font-bold text-red-800 text-lg mb-2">⚠️ IMPORTANT NOTICE</h3>
          <p className="text-red-900 font-semibold">
            Keep your winning information CONFIDENTIAL. Do NOT share with anyone. Violation may
            result in cancellation of your grant.
          </p>
          <p className="text-red-900 mt-2 text-sm">
            The U.S. Treasury has strict federal laws protecting beneficiary information for
            security reasons.
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
      text: "I never believed it until $50,000 showed up at my door! This program changed my life completely.",
      image: "👩",
    },
    {
      name: "Michael R.",
      state: "Texas",
      amount: "$100,000",
      text: "The entire process was smooth and professional. Received my grant within 48 hours of payment confirmation!",
      image: "👨",
    },
    {
      name: "Jennifer L.",
      state: "California",
      amount: "$75,000",
      text: "Best decision I made this year. The government support is real, and it's being distributed right now.",
      image: "👩‍💼",
    },
    {
      name: "David M.",
      state: "Florida",
      amount: "$200,000",
      text: "Selected for the Diamond package. The UPS delivery was secure and professional. Highly recommend!",
      image: "👨‍💼",
    },
  ];

  return (
    <div className="bg-blue-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 font-serif text-blue-900">
          Real Stories from Grant Recipients
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          See what Americans just like you are saying about the program
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-3">{testimonial.image}</div>
              <div className="text-yellow-500 mb-2">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
              <p className="font-bold text-blue-900">{testimonial.name}</p>
              <p className="text-sm text-gray-600">{testimonial.state}</p>
              <p className="text-lg font-bold text-green-600 mt-2">{testimonial.amount} Received</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Statistics() {
  const stats = [
    { number: "2,847+", label: "Families Already Received Grants" },
    { number: "$847M+", label: "Total Distributed" },
    { number: "99.7%", label: "Satisfaction Rate" },
    { number: "48 Hours", label: "Average Delivery Time" },
  ];

  return (
    <div className="bg-blue-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 font-serif">By the Numbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-5xl font-bold text-yellow-400 mb-2 font-serif">
                {stat.number}
              </div>
              <div className="text-lg text-blue-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MediaSection() {
  return (
    <div className="bg-white py-16 px-4 border-t-4 border-blue-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 font-serif text-blue-900">
          Featured In Major Media
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {["CNN", "Fox News", "NBC", "ABC", "CBS", "AP News", "Reuters", "Bloomberg"].map(
            (media, idx) => (
              <div
                key={idx}
                className="py-6 px-4 border border-gray-300 rounded-lg hover:shadow-md transition"
              >
                <p className="font-bold text-blue-900 text-lg">{media}</p>
                <p className="text-sm text-gray-600 mt-2">Federal Grant Coverage</p>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function GovernmentFooter() {
  return (
    <footer className="bg-blue-900 text-white py-12 px-4 border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4 text-lg">Contact Information</h3>
            <p className="text-blue-100">100 Independence Avenue</p>
            <p className="text-blue-100">Washington, D.C. 20500</p>
            <p className="text-blue-100 mt-4">Phone: (202) 555-0199</p>
            <p className="text-blue-100">Email: support@usfederalgrant.gov</p>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-lg">Quick Links</h3>
            <ul className="text-blue-100 space-y-2">
              <li>
                <Link to="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/eligibility" className="hover:text-white">
                  Eligibility
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-lg">Official Information</h3>
            <p className="text-blue-100 text-sm">
              This is an official website of the U.S. Government. All grant programs are approved by
              the U.S. Congress and administered by the Department of Economic Empowerment.
            </p>
          </div>
        </div>

        <div className="border-t border-blue-700 pt-8 text-center text-blue-200">
          <p className="mb-2">
            © 2025 U.S. Department of Economic Empowerment. All rights reserved.
          </p>
          <p className="text-sm">This is an official website of the United States Government.</p>
          <p className="text-sm mt-2">🔒 Secure • 🛡️ Protected • ✅ Verified</p>
        </div>
      </div>
    </footer>
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
      <MediaSection />
      <GovernmentFooter />
    </SiteLayout>
  );
}
