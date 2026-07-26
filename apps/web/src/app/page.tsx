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
      console.log("onFileInput fired, files:", e.target.files);
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16 gap-10">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">ResumeLint</h1>
        <p className="text-[var(--color-muted)] mt-1">The engineering-grade resume linter.</p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`w-full max-w-xl border-2 border-dashed rounded-[var(--radius-sharp)] p-12 text-center transition-colors ${
          isDragging
            ? "border-[var(--color-accent-orange)] bg-[var(--color-graphite)]"
            : "border-[var(--color-steel)] bg-[var(--color-graphite)]"
        }`}
      >
        <p className="mb-4">Drag & drop your resume here</p>
        <p className="text-sm text-[var(--color-muted)] mb-4">PDF, DOCX, or TXT — up to 5 MB</p>
        <label className="inline-block cursor-pointer border border-[var(--color-steel)] rounded-[var(--radius-sharp)] px-4 py-2 hover:border-[var(--color-accent-orange)] transition-colors">
          <span>Browse files</span>
          <input
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            onChange={onFileInput}
            className="hidden"
          />
        </label>
      </div>

      {status === "uploading" && (
        <p className="text-[var(--color-accent-blue)]">Analyzing your resume…</p>
      )}

      {status === "error" && errorMessage && (
        <p className="text-[var(--color-diagnostic-red)]">{errorMessage}</p>
      )}

      {result && (
        <div className="w-full max-w-2xl bg-[var(--color-graphite)] border border-[var(--color-steel)] rounded-[var(--radius-sharp)] p-6">
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-4xl font-semibold text-[var(--color-diagnostic-green)]">
              {result.overall_score}
            </span>
            <span className="text-[var(--color-muted)]">/ 100</span>
          </div>
          <p className="text-sm text-[var(--color-muted)] mb-4">
            Full report UI coming next — here's the raw analysis for now:
          </p>
          <pre className="text-xs overflow-auto max-h-96 bg-[var(--color-charcoal)] p-4 rounded-[var(--radius-sharp)]">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}