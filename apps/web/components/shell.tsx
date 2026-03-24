import Link from "next/link";
import type { ReactNode } from "react";

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-black/5 bg-white/50 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-2xl font-semibold">
            InterviewPilot
          </Link>
          <nav className="flex items-center gap-5 text-sm font-medium text-stone-700">
            <Link href="/candidate">Interview</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
