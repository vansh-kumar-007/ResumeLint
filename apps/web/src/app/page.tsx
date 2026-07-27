"use client";

import { useState, useCallback } from "react";
import { uploadAndAnalyze, ApiError } from "@/lib/api";
import { ReportView } from "@/components/report/ReportView";
import type { AnalysisResult } from "@/types/analysis";
import { UploadCloud, ScanLine, Brain, ListChecks } from "lucide-react";

const ACCEPTED_TYPES = [".pdf", ".docx", ".txt"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export default function HomePage() {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

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

    setFileName(file.name);
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
    <main className="min-h-screen flex flex-col items-center px-6 py-16 gap-10">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="border-3 border-[var(--color-border)] bg-[var(--color-surface)] rounded-[14px] px-10 py-6 shadow-[8px_8px_0px_var(--color-border)]">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none">
              RESUME
              <br />
              LINT
            </h1>
          </div>
          <span className="absolute -top-3 -right-3 neu-badge rotate-3">Beta</span>
        </div>
        <p className="text-[var(--color-muted)] mt-6 max-w-md mx-auto">
          The engineering-grade protocol for resume diagnostics. Deterministic scoring,
          AI-assisted rewrites, zero fluff.
        </p>
      </div>

      <div className="w-full max-w-2xl flex gap-3 items-stretch">
        <div className="flex-1 neu-input flex items-center gap-2 px-4">
          <span className="text-[var(--color-pink)] font-mono font-bold">$</span>
          <span className="font-mono text-sm text-[var(--color-muted)] truncate">
            {fileName ?? "awaiting_resume_upload"}
          </span>
        </div>
        <label className="neu-btn flex items-center gap-2 px-5 whitespace-nowrap">
          <ScanLine size={18} />
          Scan
          <input
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            onChange={onFileInput}
            className="hidden"
          />
        </label>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`w-full max-w-2xl border-3 border-dashed rounded-[14px] p-10 text-center transition-colors ${
          isDragging ? "border-[var(--color-pink)] bg-white" : "border-[var(--color-border)]"
        }`}
      >
        <UploadCloud className="mx-auto mb-2 text-[var(--color-muted)]" size={26} />
        <p className="text-sm text-[var(--color-muted)]">
          or drag & drop — PDF, DOCX, TXT — up to 5 MB
        </p>
      </div>

      {status === "uploading" && (
        <p className="font-mono text-sm text-[var(--color-pink)]">&gt; scanning_resume...</p>
      )}
      {status === "error" && errorMessage && (
        <p className="font-mono text-sm text-[var(--color-diagnostic-red)]">! {errorMessage}</p>
      )}

      {!result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
          {[
            { icon: ListChecks, title: "Rule Engine", desc: "Deterministic, explainable scoring." },
            { icon: Brain, title: "AI Rewrites", desc: "Groq/OpenRouter-powered suggestions." },
            { icon: ScanLine, title: "ATS Simulation", desc: "See what parsers actually detect." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="neu-panel text-center">
              <Icon className="mx-auto mb-2" size={22} />
              <h3 className="font-bold text-sm uppercase tracking-wide">{title}</h3>
              <p className="text-xs text-[var(--color-muted)] mt-1">{desc}</p>
            </div>
          ))}
        </div>
      )}

      {result && <ReportView result={result} />}
    </main>
  );
}