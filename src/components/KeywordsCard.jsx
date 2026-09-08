import Card from "./ui/Card.jsx";
import Badge from "./ui/Badge.jsx";

function keywordTone(keyword) {
  if (keyword.matched) return "success";
  return keyword.priority === "required" ? "destructive" : "warning";
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.5l3 3 7-7" />
    </svg>
  );
}

export default function KeywordsCard({ keywords, gaps }) {
  const byCategory = keywords.reduce((acc, kw) => {
    (acc[kw.category] ??= []).push(kw);
    return acc;
  }, {});

  return (
    <Card className="p-6" data-testid="card-keywords">
      <h2 className="text-base font-semibold">Keywords extracted from the JD</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Green = already in your resume. Red = required &amp; missing. Amber = preferred &amp; missing.
      </p>

      <div className="mt-4 space-y-4">
        {Object.entries(byCategory).map(([category, items]) => (
          <div key={category}>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{category}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {items.map((kw) => (
                <Badge key={kw.term} tone={keywordTone(kw)} className="gap-1 font-mono">
                  {kw.matched && <CheckIcon />}
                  {kw.term}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      {gaps.length > 0 && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Requested but not in your background
          </p>
          <div className="mt-2 space-y-2">
            {gaps.map((gap) => (
              <div key={gap.term} className="rounded-md bg-muted p-2.5">
                <p className="text-sm font-medium">{gap.term}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{gap.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
