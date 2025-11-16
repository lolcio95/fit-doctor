"use client";
import React, { useCallback, useRef, useState } from "react";
import { Cloud, UploadCloud, FileText, X, Check } from "lucide-react";

type Props = {
  paymentId: string;
  onUploaded?: () => void;
  maxTotalSizeMB?: number; // opcjonalne ograniczenie rozmiaru sumarycznego
  acceptedTypes?: string; // np. "image/*,application/pdf,video/mp4"
};

type FileState = {
  file: File;
  uploaded: boolean;
  error?: string | null;
};

export default function AdminFilesUploader({
  paymentId,
  onUploaded,
  maxTotalSizeMB = 50,
  acceptedTypes = "image/*,application/pdf,video/mp4",
}: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<FileState[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const arr = Array.from(incoming);

      // optionally check total size
      const totalSizeBytes = arr.reduce((s, f) => s + f.size, 0);
      const maxBytes = maxTotalSizeMB * 1024 * 1024;
      if (totalSizeBytes > maxBytes) {
        alert(
          `Suma plików przekracza ${maxTotalSizeMB}MB. Zmniejsz rozmiar lub wyślij mniejsze pliki.`
        );
        return;
      }

      setFiles((prev) => [
        ...prev,
        ...arr.map((f) => ({ file: f, uploaded: false, error: null })),
      ]);
    },
    [maxTotalSizeMB]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      addFiles(e.target.files);
      // reset input so same file can be selected again if needed
      if (inputRef.current) inputRef.current.value = "";
    },
    [addFiles]
  );

  const removeFile = useCallback((idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const uploadAll = useCallback(async () => {
    if (files.length === 0) return;
    setUploading(true);
    setProgress(0);

    try {
      // send all files in one FormData request
      const form = new FormData();
      form.append("paymentId", paymentId);
      files.forEach((f) => form.append("files", f.file, f.file.name));

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/files/upload-files");

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setProgress(pct);
          }
        };

        xhr.onreadystatechange = () => {
          if (xhr.readyState !== 4) return;
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(
              new Error(xhr.responseText || `Upload failed: ${xhr.status}`)
            );
          }
        };

        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(form);
      });

      // SUCCESS: remove successfully uploaded files from the list (keep only files that have error)
      setFiles((prev) => prev.filter((p) => !!p.error)); // keep only errored entries (if any)
      setProgress(100);

      if (onUploaded) onUploaded();
    } catch (err: any) {
      console.error("Upload error", err);
      // mark errors on all files (simple approach)
      setFiles((prev) =>
        prev.map((p) => ({ ...p, error: err.message || "Upload failed" }))
      );
      alert("Błąd podczas uploadu. Sprawdź konsolę.");
    } finally {
      setUploading(false);
      // optionally clear progress after short delay:
      setTimeout(() => setProgress(0), 800);
    }
  }, [files, paymentId, onUploaded]);

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`border-2 rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? "border-dashed border-blue-400 bg-blue-50"
            : "border-dashed border-gray-300 bg-gray-700"
        }`}
        style={{ cursor: "pointer" }}
        onClick={() => inputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="p-3 rounded-full border">
            <UploadCloud className="w-6 h-6 text-gray-300" />
          </div>

          <div className="text-sm font-medium">
            Wyszukaj plik, lub przenieś i upuść go tutaj
          </div>

          <div className="mt-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              className="px-4 py-1.5 bg-gray-500 border rounded-md text-sm shadow-sm hover:bg-gray-400 font-bold text-white"
            >
              Wyszukaj plik
            </button>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={onFileChange}
          className="hidden"
        />
      </div>

      {/* Selected files list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((fstate, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-4 p-2 border rounded"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-gray-50">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">{fstate.file.name}</div>
                  <div className="text-xs text-gray-400">
                    {(fstate.file.size / 1024).toFixed(0)} KB •{" "}
                    {fstate.file.type || "—"}
                  </div>
                  {fstate.error && (
                    <div className="text-xs text-red-500 mt-1">
                      {fstate.error}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {fstate.uploaded ? (
                  <span className="flex items-center gap-1 text-green-600 text-sm">
                    <Check className="w-4 h-4" /> Uploaded
                  </span>
                ) : (
                  <button
                    onClick={() => removeFile(idx)}
                    disabled={uploading}
                    className="p-1 rounded hover:bg-gray-100"
                    title="Usuń plik"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* progress + actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded overflow-hidden">
                <div
                  style={{ width: `${progress}%` }}
                  className={`h-full bg-blue-500 transition-all ${progress === 0 ? "opacity-0" : "opacity-100"}`}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">{progress}%</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={uploadAll}
                disabled={uploading || files.length === 0}
                className={`px-3 py-1.5 rounded text-sm ${uploading ? "bg-gray-200 text-gray-600" : "bg-blue-600 text-white hover:bg-blue-700"}`}
              >
                {uploading ? (
                  "Uploading..."
                ) : (
                  <span className="flex items-center gap-2">
                    <Cloud className="w-4 h-4" /> Upload
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
