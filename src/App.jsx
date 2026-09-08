import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import ResumeLibrary from "./components/ResumeLibrary.jsx";
import JobDescriptionCard from "./components/JobDescriptionCard.jsx";
import ScoreCard from "./components/ScoreCard.jsx";
import KeywordsCard from "./components/KeywordsCard.jsx";
import SuggestionsCard from "./components/SuggestionsCard.jsx";
import ApplyCard from "./components/ApplyCard.jsx";
import * as api from "./lib/api.js";

const ANALYSIS_LIMIT_KEY = "reztailor-analysis-limit";
const ANALYSIS_LIMIT_COUNT = 3;
const ANALYSIS_LIMIT_MS = 24 * 60 * 60 * 1000;

function readAnalysisLimitState() {
  if (typeof window === "undefined") {
    return { count: 0, startedAt: Date.now() };
  }

  try {
    const raw = window.localStorage.getItem(ANALYSIS_LIMIT_KEY);
    if (!raw) {
      return { count: 0, startedAt: Date.now() };
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.count !== "number" || typeof parsed.startedAt !== "number") {
      return { count: 0, startedAt: Date.now() };
    }

    return { count: parsed.count, startedAt: parsed.startedAt };
  } catch {
    return { count: 0, startedAt: Date.now() };
  }
}

function getAnalysisLimitStatus() {
  const now = Date.now();
  const { count, startedAt } = readAnalysisLimitState();

  if (now - startedAt >= ANALYSIS_LIMIT_MS) {
    return { count: 0, startedAt: now, reached: false };
  }

  return { count, startedAt, reached: count >= ANALYSIS_LIMIT_COUNT };
}

function saveAnalysisLimitState(nextCount, startedAt) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ANALYSIS_LIMIT_KEY, JSON.stringify({ count: nextCount, startedAt }));
}

function recordSuccessfulAnalysis() {
  const now = Date.now();
  const current = readAnalysisLimitState();

  if (now - current.startedAt >= ANALYSIS_LIMIT_MS) {
    saveAnalysisLimitState(1, now);
    return getAnalysisLimitStatus();
  }

  const nextCount = current.count + 1;
  saveAnalysisLimitState(nextCount, current.startedAt);
  return { count: nextCount, startedAt: current.startedAt, reached: nextCount >= ANALYSIS_LIMIT_COUNT };
}

export default function App() {
  const [resumes, setResumes] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null); // { analysisId, score, roleGuess, ..., keywords, gaps, suggestions, activeResumeIdAtAnalyze }
  const [accepted, setAccepted] = useState(new Set());
  const [edits, setEdits] = useState({});
  const [applying, setApplying] = useState(false);
  const [applyResult, setApplyResult] = useState(null); // { appliedCount, updatedScore, updatedKeywords, downloadUrl }
  const [error, setError] = useState(null);
  const [analysisLimitReached, setAnalysisLimitReached] = useState(() => getAnalysisLimitStatus().reached);

  const activeResume = resumes.find((r) => r.isActive) ?? null;

  async function refreshResumes() {
    const { resumes: next } = await api.listResumes();
    setResumes(next);
    return next;
  }

  useEffect(() => {
    refreshResumes().finally(() => setLoaded(true));
  }, []);

  async function handleResumesChanged() {
    const previousActiveId = activeResume?.id;
    const next = await refreshResumes();
    const newActiveId = next.find((r) => r.isActive)?.id;
    if (analysis && newActiveId !== previousActiveId) {
      setAnalysis(null);
      setApplyResult(null);
    }
  }

  async function handleAnalyze() {
    const limitStatus = getAnalysisLimitStatus();
    if (limitStatus.reached) {
      setAnalysisLimitReached(true);
      setError("You’ve reached the 3-analysis limit for this device. Try again in 24 hours.");
      return;
    }

    setAnalyzing(true);
    setError(null);
    try {
      const result = await api.analyze(jobDescription);
      const nextLimitStatus = recordSuccessfulAnalysis();
      setAnalysisLimitReached(nextLimitStatus.reached);
      setAnalysis({ ...result, activeResumeIdAtAnalyze: activeResume?.id });
      setAccepted(new Set(result.suggestions.map((s) => s.suggestion_id)));
      setEdits({});
      setApplyResult(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  }

  function handleReset() {
    setJobDescription("");
    setAnalysis(null);
    setApplyResult(null);
    setAccepted(new Set());
    setEdits({});
    setError(null);
    setAnalysisLimitReached(getAnalysisLimitStatus().reached);
  }

  function handleToggleSuggestion(id) {
    setAccepted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleEditSuggestion(id, text) {
    setEdits((prev) => ({ ...prev, [id]: text }));
  }

  async function handleApply() {
    setApplying(true);
    setError(null);
    try {
      const result = await api.apply(analysis.analysisId, Array.from(accepted), edits);
      setApplyResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setApplying(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header candidateName={activeResume?.candidateName} />

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
        {loaded && (
          <ResumeLibrary resumes={resumes} onChanged={handleResumesChanged} />
        )}

        {error && (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <JobDescriptionCard
          jobDescription={jobDescription}
          onChange={setJobDescription}
          onAnalyze={handleAnalyze}
          onReset={handleReset}
          analyzing={analyzing}
          hasResult={!!analysis}
          analysisLimitReached={analysisLimitReached}
        />

        {analysis && (
          <>
            <ScoreCard analysis={analysis} updatedScore={applyResult?.updatedScore} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <KeywordsCard keywords={applyResult?.updatedKeywords ?? analysis.keywords} gaps={analysis.gaps} />
              <SuggestionsCard
                suggestions={analysis.suggestions}
                accepted={accepted}
                edits={edits}
                onToggle={handleToggleSuggestion}
                onEdit={handleEditSuggestion}
                disabled={!!applyResult}
              />
            </div>
            <ApplyCard
              acceptedCount={accepted.size}
              totalCount={analysis.suggestions.length}
              applying={applying}
              applyResult={applyResult}
              onApply={handleApply}
            />
          </>
        )}
      </main>
    </div>
  );
}
