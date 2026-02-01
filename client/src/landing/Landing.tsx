import { ReactNode } from "react";
import { Video, ShieldCheck, Users, Sparkles, ArrowRight, Code } from "lucide-react";
import { CustomCenter } from "../components/CustomComp";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {

  const navigate = useNavigate();
  return (
<CustomCenter className="flex flex-col justify-center items-center w-full min-h-screen dark:bg-dark-background bg-light-background dark:text-gray-100">
    <div className="flex flex-col w-full lg:w-full h-[100vh] overflow-auto scrollbar-hide">

      {/* Hero */}

      <section className="relative">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-16 px-6 py-32 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-bahia-500/10 px-4 py-1 text-sm font-medium text-bahia-600">
              <Sparkles size={16} /> Smart Interview Platform
            </span>

            <h1 className="mt-6 text-5xl font-extrabold leading-tight">
              Hire With Confidence Using
              <span className="block text-bahia-600">Real-World Interviews</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-400">
              Conduct structured interviews with real-time video, live coding,
              and secure sessions — directly in the browser.
            </p>

            <div className="mt-10">
              <button
                className="inline-flex items-center gap-2 rounded-xl bg-bahia-600 px-6 py-3 font-medium text-white hover:bg-bahia-700"
                onClick={()=>navigate("/signup")}
              >
                Get Started <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-emerald-500/20 blur-2xl" />
            <div className="relative rounded-3xl bg-white dark:bg-slate-900 p-10 shadow-2xl">
              <Video className="mx-auto h-32 w-32 text-bahia-600" />
              <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Live WebRTC Interview Session
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <Stat value="<150ms" label="Low Latency Video" />
          <Stat value="100%" label="Browser Based" />
          <Stat value="Encrypted" label="Secure Sessions" />
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-16 text-center text-3xl font-bold">
            Built for Modern Hiring
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Feature icon={<Video />} title="Real-Time Video" desc="Low-latency WebRTC interviews." />
            <Feature icon={<ShieldCheck />} title="Secure Interviews" desc="End-to-end encrypted sessions." />
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="bg-white dark:bg-slate-900 py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="mb-16 text-3xl font-bold">Designed for Everyone</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Role title="Candidates" desc="Join instantly with zero setup." />
            <Role title="Interviewers" desc="Assess skills with structured tools." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bahia-500 py-24 text-center text-white">
        <h2 className="mb-4 text-4xl font-bold">Interview Better. Hire Smarter.</h2>
        <p className="mb-10 text-lg">A professional interview experience for modern teams.</p>
        <button onClick={()=>navigate("/signup")}
          className="inline-block rounded-xl bg-white px-8 py-3 font-medium text-bahia-600 hover:bg-slate-100"
        >
          Create Free Account
        </button>
      </section>

      <footer className="bg-slate-900 py-8 text-center text-sm text-slate-400 mb-5">
        © 2026 Interview Platform · Secure · Scalable
      </footer>
    </div>
    </CustomCenter>
  );
}

function Feature({ icon, title, desc }:{icon:ReactNode, title:string, desc:string }) {
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 p-8 shadow hover:shadow-xl transition">
      <div className="mb-5 text-bahia-600">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-slate-600 dark:text-slate-400">{desc}</p>
    </div>
  );
}

function Role({ title, desc }:{title: string, desc:string}) {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
      <Users className="mx-auto mb-4 text-bahia-600" />
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-slate-600 dark:text-slate-400">{desc}</p>
    </div>
  );
}

function Stat({ value, label }:{value:string, label:string}) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 p-8 shadow">
      <p className="text-3xl font-bold text-bahia-600">{value}</p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{label}</p>
    </div>
  );
}
