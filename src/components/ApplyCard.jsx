import Card from "./ui/Card.jsx";
import Button from "./ui/Button.jsx";

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0-4-4m4 4 4-4M4 20h16" />
    </svg>
  );
}

export default function ApplyCard({ acceptedCount, totalCount, applying, applyResult, onApply }) {
  const isStickyFooter = !applyResult;

  return (
    <Card
      className={
        isStickyFooter
          ? "sticky bottom-0 z-10 flex items-center justify-between gap-4 p-6"
          : "flex items-center justify-between gap-4 p-6"
      }
      data-testid="card-apply"
    >
      {applyResult ? (
        <>
          <p className="text-sm text-muted-foreground">
            {applyResult.appliedCount} change{applyResult.appliedCount === 1 ? "" : "s"} applied to a new tailored
            copy.
          </p>
          <a
            href={applyResult.downloadUrl}
            download
            data-testid="button-download"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            <DownloadIcon />
            Download tailored resume (.docx)
          </a>
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {acceptedCount} of {totalCount} suggested changes selected. Your base resume file stays untouched — this
            creates a new tailored copy.
          </p>
          <Button onClick={onApply} disabled={applying || acceptedCount === 0} data-testid="button-apply">
            {applying ? "Updating…" : "Update the resume"}
          </Button>
        </>
      )}
    </Card>
  );
}
