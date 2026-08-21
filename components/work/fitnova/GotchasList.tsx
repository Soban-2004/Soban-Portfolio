// Real deployment gotchas — the actual numbered "Three real gotchas hit
// during this project's actual deploy" list from the FitNova README,
// verified directly against the source (not the paraphrase in profile.md,
// which had conflated this list with two unrelated bugs mentioned elsewhere
// in the same README).

const GOTCHAS = [
  "Render defaults to a very new Python (3.14 at the time) with no prebuilt wheel yet for rapidfuzz, and its source-build fallback failed on an unrelated pyproject.toml strictness bug — fixed by pinning PYTHON_VERSION=3.10.13 in render.yaml.",
  "Monorepo root directory: git init ran inside fitnova/ itself, so that directory is the repo root — render.yaml's rootDir and Vercel's Root Directory both had to be just backend / frontend, not fitnova/backend / fitnova/frontend.",
  "Migrations self-run on boot (alembic upgrade head, as a subprocess, before the worker starts) specifically so there's no separate manual migration step to forget on a host like Render's free tier with no reliable pre-deploy hook.",
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
