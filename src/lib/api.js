export const API_BASE_URL = import.meta.env.VITE_API_URL || "";

async function request(path, options) {
  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, credentials: "include" });
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json() : null;
  if (!res.ok) {
    throw new Error(body?.message || `Request to ${path} failed (${res.status})`);
  }
  return body;
}

export function getActiveResume() {
  return request("/api/resume");
}

export function listResumes() {
  return request("/api/resumes");
}

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("resume", file);
  return request("/api/resumes", { method: "POST", body: formData });
}

export function activateResume(id) {
  return request(`/api/resumes/${id}/activate`, { method: "POST" });
}

export function deleteResume(id) {
  return request(`/api/resumes/${id}`, { method: "DELETE" });
}

export function analyze(jobDescription) {
  return request("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobDescription }),
  });
}

export function apply(analysisId, acceptedSuggestionIds, edits) {
  return request("/api/apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ analysisId, acceptedSuggestionIds, edits }),
  });
}