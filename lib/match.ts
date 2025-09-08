// lib/match.ts
export type CandidateSkill = { name: string; level?: number | null };
export type JobRequirement = { name: string; min?: number | null };

export function computeScore(
  candidateSkills: CandidateSkill[],
  jobReqs: JobRequirement[]
) {
  if (!jobReqs?.length) return { score: 0, explanation: "No job requirements." };

  const skillsLower = candidateSkills.map(s => ({
    name: s.name.toLowerCase(),
    level: s.level ?? 3,
  }));

  let gained = 0;
  const perReqMax = 10;
  const max = jobReqs.length * perReqMax;
  const lines: string[] = [];

  for (const req of jobReqs) {
    const need = req.min ?? 3;
    const found = skillsLower.find(s => s.name === (req.name || "").toLowerCase());
    if (found) {
      const unit = 6 + Math.max(0, Math.min(4, found.level - need + 2));
      gained += unit;
      lines.push(`✓ ${req.name}: need ${need}, has ${found.level} → +${unit}/${perReqMax}`);
    } else {
      lines.push(`✗ ${req.name}: missing → +0/${perReqMax}`);
    }
  }

  const score = Math.round((gained / max) * 100);
  const explanation =
    `Requirements matched: ${jobReqs.length}. Total ${gained}/${max} → ${score}%.\n` +
    lines.join("\n");

  return { score, explanation };
}
