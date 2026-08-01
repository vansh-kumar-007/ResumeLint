"use client";

import { useState, useCallback } from "react";
import { uploadAndAnalyze, ApiError, type AnalysisResult } from "@/lib/api";

const ACCEPTED_TYPES = [".pdf", ".docx", ".txt"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export default function HomePage() {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleFile = useCallback(async (file: File) => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) {
      setStatus("error");
      setErrorMessage(`Unsupported file type. Allowed: ${ACCEPTED_TYPES.join(", ")}`);
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setStatus("error");
      setErrorMessage("File exceeds the 5 MB limit.");
      return;
    }

    setStatus("uploading");
    setErrorMessage(null);
    setResult(null);

    try {
      const analysis = await uploadAndAnalyze(file);
      setResult(analysis);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof ApiError ? err.message : "Something went wrong.");
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16 gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">ResumeLint</h1>
        <p className="text-[var(--color-muted)] mt-1">Upload form test — no styled report yet.</p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`w-full max-w-lg bg-[var(--color-surface)] border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
          isDragging ? "border-[var(--color-indigo)]" : "border-[var(--color-border)]"
        }`}
      >
        <p className="mb-1">Drag & drop your resume</p>
        <p className="text-sm text-[var(--color-muted)] mb-4">PDF, DOCX, or TXT — up to 5 MB</p>
        <label className="inline-block cursor-pointer bg-[var(--color-indigo)] text-white text-sm font-medium px-5 py-2.5 rounded-lg">
          Browse files
          <input
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            onChange={onFileInput}
            className="hidden"
          />
        </label>
      </div>

      {status === "uploading" && <p className="text-[var(--color-indigo)]">Analyzing…</p>}
      {status === "error" && errorMessage && (
        <p className="text-[var(--color-danger)]">{errorMessage}</p>
      )}

      {result && (
        <div className="w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
          <p className="text-4xl font-bold mb-2">{result.overall_score}<span className="text-lg text-[var(--color-muted)]">/100</span></p>
          <pre className="text-xs overflow-auto max-h-96 bg-[var(--color-bg)] p-4 rounded-lg">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}