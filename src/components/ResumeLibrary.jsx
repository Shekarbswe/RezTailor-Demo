import { useRef, useState } from "react";
import Card from "./ui/Card.jsx";
import Button from "./ui/Button.jsx";
import * as api from "../lib/api.js";

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0-4 4m4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7h10Z" />
    </svg>
  );
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function ResumeLibrary({ resumes, onChanged }) {
  const [busyId, setBusyId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  async function handleFileChosen(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".docx")) {
      setError("Only .docx files are supported.");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      await api.uploadResume(file);
      await onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleActivate(id) {
    setBusyId(id);
    setError(null);
    try {
      await api.activateResume(id);
      await onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id, e) {
    e.stopPropagation();
    setBusyId(id);
    setError(null);
    try {
      await api.deleteResume(id);
      await onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Card className="p-6" data-testid="card-resume-library">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Your resumes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload one or more resumes, then pick which one is active before tailoring against a job description.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          data-testid="button-upload-resume"
        >
          <UploadIcon />
          {uploading ? "Uploading…" : "Upload resume"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".docx"
          className="hidden"
          onChange={handleFileChosen}
          data-testid="input-resume-upload"
        />
      </div>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      {resumes.length === 0 ? (
        <p className="mt-4 rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
          No resumes yet — upload a .docx to get started.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border" data-testid="list-resumes">
          {resumes.map((resume) => (
            <li
              key={resume.id}
              onClick={() => !resume.isActive && handleActivate(resume.id)}
              className={`flex cursor-pointer items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 ${busyId === resume.id ? "opacity-50" : ""
                }`}
              data-testid={`resume-row-${resume.id}`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${resume.isActive ? "bg-success" : "bg-border"}`} />
                  <span className="truncate text-sm font-medium">{resume.candidateName}</span>
                  {resume.isActive && (
                    <span className="shrink-0 rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                      Active
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {resume.originalFilename} · uploaded {formatDate(resume.uploadedAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => handleDelete(resume.id, e)}
                disabled={resumes.length === 1 || busyId === resume.id}
                aria-label={`Delete ${resume.originalFilename}`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-destructive disabled:opacity-30"
                data-testid={`button-delete-resume-${resume.id}`}
              >
                <TrashIcon />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
