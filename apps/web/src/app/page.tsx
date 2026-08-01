"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { uploadAndAnalyze, ApiError } from "@/lib/api";
import { ReportView } from "@/components/report/ReportView";
import type { AnalysisResult } from "@/types/analysis";
import { UploadCloud, FileSearch } from "lucide-react";

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

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-indigo)] to-[var(--color-cyan)] flex items-center justify-center">
            <FileSearch size={16} className="text-white" />
          </div>
          <span className="font-semibold">ResumeLint</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 flex flex-col items-center gap-8">
        {!result && (
          <>
            <div className="text-center max-w-lg">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Analyze your resume</h1>
              <p className="text-[var(--color-muted)]">
                Deterministic ATS scoring with AI-assisted rewrite suggestions.
              </p>
            </div>

            <motion.div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              animate={{ scale: isDragging ? 1.02 : 1 }}
              className="w-full max-w-lg bg-[var(--color-surface)] border-2 border-dashed rounded-xl p-10 text-center"
              style={{ borderColor: isDragging ? "var(--color-indigo)" : "var(--color-border)" }}
            >
              <UploadCloud className="mx-auto mb-3 text-[var(--color-indigo)]" size={26} />
              <p className="text-sm mb-1">Drag & drop your resume</p>
              <p className="text-xs text-[var(--color-muted)] mb-4">PDF, DOCX, or TXT — up to 5 MB</p>
              <label className="inline-block cursor-pointer bg-[var(--color-indigo)] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
                Browse files
                <input type="file" accept={ACCEPTED_TYPES.join(",")} onChange={onFileInput} className="hidden" />
              </label>
            </motion.div>
          </>
        )}

        {status === "uploading" && <p className="text-sm text-[var(--color-indigo)]">Analyzing your resume…</p>}
        {status === "error" && errorMessage && <p className="text-sm text-[var(--color-danger)]">{errorMessage}</p>}

        {result && <ReportView result={result} />}
      </main>
    </div>
  );
}