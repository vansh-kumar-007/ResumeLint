import type { AnalysisResult } from "@/types/analysis";
import type { SuggestionsResult } from "@/types/suggestions";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function uploadResume(file: File): Promise<{ id: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/resumes/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.detail ?? "Upload failed", res.status);
  }

  return res.json();
}

async function analyzeResume(resumeId: string): Promise<AnalysisResult> {
  const res = await fetch(`${API_URL}/resumes/${resumeId}/analyze`, {
    method: "POST",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.detail ?? "Analysis failed", res.status);
  }

  return res.json();
}

export async function uploadAndAnalyze(file: File): Promise<AnalysisResult> {
  const { id } = await uploadResume(file);
  return analyzeResume(id);
}

export async function fetchSuggestions(resumeId: string): Promise<SuggestionsResult> {
  const res = await fetch(`${API_URL}/resumes/${resumeId}/suggestions`, { method: "POST" });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.detail ?? "Suggestions failed", res.status);
  }
  return res.json();
}