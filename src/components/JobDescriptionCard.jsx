import Card from "./ui/Card.jsx";
import Button from "./ui/Button.jsx";

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2z" />
    </svg>
  );
}

export default function JobDescriptionCard({
  jobDescription,
  onChange,
  onAnalyze,
  onReset,
  analyzing,
  hasResult,
  analysisLimitReached,
}) {
  return (
    <Card className="p-6" data-testid="card-jd-input">
      <h2 className="text-base font-semibold">Paste the job description</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        We&apos;ll extract keywords, score your base resume against them, and suggest truthful, targeted edits —
        your base resume file is never modified.
      </p>

      <textarea
        value={jobDescription}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the full job posting here…"
        rows={8}
        className="mt-4 h-52 w-full resize-none overflow-y-auto overflow-x-hidden rounded-md border border-input bg-transparent p-3 font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        data-testid="input-job-description"
      />

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{jobDescription.length} characters</span>
        <div className="flex items-center gap-2">
          {hasResult && (
            <Button variant="outline" onClick={onReset} data-testid="button-reset">
              New analysis
            </Button>
          )}
          <Button
            onClick={onAnalyze}
            disabled={analyzing || analysisLimitReached || jobDescription.trim().length < 10}
            data-testid="button-analyze"
          >
            {analyzing ? (
              "Analyzing…"
            ) : analysisLimitReached ? (
              "Try again"
            ) : (
              <>
                <SparkleIcon />
                Analyze job description
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
