import Card from "./ui/Card.jsx";

function TargetIcon({ className }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8" cy="8" r="2.5" fill="currentColor" />
    </svg>
  );
}

function scoreColor(score) {
  if (score >= 7) return "hsl(var(--success))";
  if (score >= 4) return "hsl(var(--warning))";
  return "hsl(var(--destructive))";
}

function ScoreDial({ score }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(10, score)) / 10;
  const offset = circumference * (1 - pct);
  const color = scoreColor(score);

  return (
    <div className="relative h-28 w-28 shrink-0" data-testid="score-dial">
      <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }} data-testid="text-score">
          {score.toFixed(1)}
        </span>
        <span className="text-[11px] text-muted-foreground">out of 10</span>
      </div>
    </div>
  );
}

export default function ScoreCard({ analysis, updatedScore }) {
  const requiredKeywords = analysis.keywords.filter((k) => k.priority === "required");
  const preferredKeywords = analysis.keywords.filter((k) => k.priority === "preferred");
  const requiredMatched = requiredKeywords.filter((k) => k.matched).length;
  const preferredMatched = preferredKeywords.filter((k) => k.matched).length;
  const displayScore = updatedScore ?? analysis.score;

  return (
    <Card className="flex items-center gap-6 p-6" data-testid="card-score">
      <ScoreDial score={displayScore} />
      <div>
        <p className="text-sm font-medium text-muted-foreground">Match score against your base resume</p>
        {analysis.roleGuess && <p className="mt-0.5 text-lg font-semibold">{analysis.roleGuess}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <TargetIcon className="h-4 w-4 text-destructive" />
            Required: <span className="font-medium text-foreground">{requiredMatched}/{requiredKeywords.length}</span>
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <TargetIcon className="h-4 w-4 text-warning" />
            Preferred: <span className="font-medium text-foreground">{preferredMatched}/{preferredKeywords.length}</span>
          </span>
        </div>
        {updatedScore != null && updatedScore !== analysis.score && (
          <p className="mt-2 text-xs text-success" data-testid="text-score-change">
            Updated from {analysis.score.toFixed(1)} → {updatedScore.toFixed(1)}
          </p>
        )}
      </div>
    </Card>
  );
}
