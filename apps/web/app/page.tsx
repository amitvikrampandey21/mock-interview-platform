import Link from "next/link";
import { Shell } from "../components/shell";

const features = [
  "Practice interviews based on your role and skills",
  "Add projects and focus areas before generating questions",
  "Answer in text mode or voice mode",
  "Get score and feedback after submission"
];

export default function HomePage() {
  return (
    <Shell>
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-black/5 bg-white/70 p-8 shadow-card backdrop-blur md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ember">Mock interview practice</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-tight text-ink md:text-7xl">
            Practice interview questions based on your own profile.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">
            Enter your role, experience, skills, and projects. The platform creates a mock interview set so you can practice in a simple way.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/candidate" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white">
              Start Practice
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-forest/15 bg-forest p-8 text-white shadow-card">
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">What you can do here</p>
          <div className="mt-6 space-y-4">
            {features.map((feature) => (
              <div key={feature} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                {feature}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-white/70 p-6 shadow-card">
          <p className="text-4xl font-semibold text-ember">Role</p>
          <p className="mt-3 text-sm text-stone-700">Choose the role you want to prepare for before starting the interview.</p>
        </div>
        <div className="rounded-3xl bg-white/70 p-6 shadow-card">
          <p className="text-4xl font-semibold text-forest">Projects</p>
          <p className="mt-3 text-sm text-stone-700">Add your projects so the questions feel closer to a real interview.</p>
        </div>
        <div className="rounded-3xl bg-white/70 p-6 shadow-card">
          <p className="text-4xl font-semibold text-ink">Voice</p>
          <p className="mt-3 text-sm text-stone-700">You can answer by typing or by using voice mode during practice.</p>
        </div>
      </section>
    </Shell>
  );
}
