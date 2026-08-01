import type { AnalysisResult } from "@/types/analysis";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponseError(
  res: Response,
  fallbackMessage: string
): Promise<void> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.detail ?? fallbackMessage, res.status);
  }
}

async function uploadResume(file: File): Promise<{ id: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/resumes/upload`, {
    method: "POST",
    body: formData,
  });

  await handleResponseError(res, "Upload failed");

  return res.json();
}

async function analyzeResume(
  resumeId: string
): Promise<AnalysisResult> {
  const res = await fetch(`${API_URL}/resumes/${resumeId}/analyze`, {
    method: "POST",
  });

  await handleResponseError(res, "Analysis failed");

  return res.json();
}

export async function uploadAndAnalyze(
  file: File
): Promise<AnalysisResult> {
  const { id } = await uploadResume(file);
  return analyzeResume(id);
}

import type { SuggestionsResult } from "@/types/suggestions";

export async function fetchSuggestions(resumeId: string): Promise<SuggestionsResult> {
  const res = await fetch(`${API_URL}/resumes/${resumeId}/suggestions`, { method: "POST" });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.detail ?? "Suggestions failed", res.status);
  }
  return res.json();
}