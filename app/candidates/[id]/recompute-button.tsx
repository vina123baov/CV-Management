// app/candidates/[id]/recompute-button.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function RecomputeMatchesButton({ candidateId }: { candidateId: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function handleClick() {
    await fetch("/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidate_id: candidateId }),
    });
    startTransition(() => router.refresh());
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="px-3 py-1.5 rounded bg-black text-white text-sm disabled:opacity-50"
    >
      {pending ? "Computing..." : "Recompute matches"}
    </button>
  );
}
