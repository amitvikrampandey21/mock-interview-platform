import { CandidateWorkspace } from "../../components/candidate-workspace";
import { Shell } from "../../components/shell";

export default async function CandidatePage() {
  return (
    <Shell>
      <section className="rounded-[2rem] border border-black/5 bg-white/70 p-8 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ember">Interview Dashboard</p>
        <h1 className="mt-4 text-4xl font-semibold text-ink">Practice realistic interviews built from your details</h1>
        <p className="mt-4 max-w-3xl text-stone-700">
          Create a detailed interview brief, generate a realistic question set, answer by text or voice, and review your performance.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-black/5 bg-cream p-5">
            <p className="text-sm text-stone-500">Mock interviews</p>
            <p className="mt-2 text-3xl font-semibold">12</p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-cream p-5">
            <p className="text-sm text-stone-500">Average score</p>
            <p className="mt-2 text-3xl font-semibold">81%</p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-cream p-5">
            <p className="text-sm text-stone-500">Focus area</p>
            <p className="mt-2 text-3xl font-semibold">Behavioral</p>
          </div>
        </div>
      </section>

      <section id="mock-interview" className="mt-10 rounded-[2rem] bg-ink p-8 text-white shadow-card">
        <p className="text-sm uppercase tracking-[0.3em] text-white/70">Interview Launchpad</p>
        <h2 className="mt-4 text-3xl font-semibold">Role-based interview practice flow</h2>
        <p className="mt-4 max-w-2xl text-white/80">
          Fill the interview brief, generate questions that reflect your role and skills, then submit answers for feedback.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white/10 p-5">1. Fill interview details</div>
          <div className="rounded-3xl bg-white/10 p-5">2. Answer generated questions</div>
          <div className="rounded-3xl bg-white/10 p-5">3. Review interview feedback</div>
        </div>
      </section>

      <section className="mt-10">
        <CandidateWorkspace />
      </section>
    </Shell>
  );
}
