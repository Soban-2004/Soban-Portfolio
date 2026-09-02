// Real deployment gotchas — the first 3 are the numbered "gotchas hit
// during this project's actual deploy" list from the FitNova README,
// verified directly against the source (not the paraphrase in profile.md,
// which had conflated this list with two unrelated bugs mentioned elsewhere
// in the same README). The 4th is a later addition: a labeled eval harness
// (scripts/eval_issue_detection.py) that caught a real, live production
// incident — two of the three fallback-chain LLM models silently dead
// after their providers deprecated them — on its first run.

const GOTCHAS = [
  "Render defaults to a very new Python (3.14 at the time) with no prebuilt wheel yet for rapidfuzz, and its source-build fallback failed on an unrelated pyproject.toml strictness bug — fixed by pinning PYTHON_VERSION=3.10.13 in render.yaml.",
  "Monorepo root directory: git init ran inside fitnova/ itself, so that directory is the repo root — render.yaml's rootDir and Vercel's Root Directory both had to be just backend / frontend, not fitnova/backend / fitnova/frontend.",
  "Migrations self-run on boot (alembic upgrade head, as a subprocess, before the worker starts) specifically so there's no separate manual migration step to forget on a host like Render's free tier with no reliable pre-deploy hook.",
  "Both fallback-chain models — Groq's llama-3.3-70b-versatile and Gemini's gemini-2.0-flash — were silently 404ing in production after their providers deprecated/retired them, with every call quietly falling through to the Ollama tier undetected. Built a labeled eval harness (3 hand-scored transcript scenarios) to check issue-detection accuracy; it caught this dead-model failure on its very first run. A new llm_call_logs table and per-call tracking (added the same round) turned it from a guess into a queryable fact instead of just a suspicion. Fixed both model configs, which surfaced a second bug — the reasoning-model replacement needed a reasoning_effort parameter the pinned SDK didn't natively support, fixed via extra_body passthrough. Verified clean across 5 consecutive live runs.",
];

export function GotchasList() {
  return (
    <ol className="space-y-4">
      {GOTCHAS.map((gotcha, i) => (
        <li key={gotcha} className="flex gap-4">
          <span className="font-mono text-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
          <span className="text-sm text-muted">{gotcha}</span>
        </li>
      ))}
    </ol>
  );
}
