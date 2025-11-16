"use client";
import { Button } from "@/app/components/atoms/Button";
import React, { useEffect, useState } from "react";

type FileRec = {
  id: string;
  key: string;
  filename: string;
  mimetype?: string | null;
  size?: number | null;
  createdAt: string;
  uploadedBy?: string | null;
};

export default function AdminFilesList({
  paymentId,
  refreshKey,
}: {
  paymentId: string;
  refreshKey?: number; // zmiana klucza wymusi przeładowanie listy
}) {
  const [files, setFiles] = useState<FileRec[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(
        `/api/files/payment-files?paymentId=${encodeURIComponent(paymentId)}`
      );
      if (r.ok) {
        const data = await r.json();
        setFiles(data.files || []);
      } else {
        console.error("Could not load files:", await r.text());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // reload on mount and whenever paymentId or refreshKey changes
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId, refreshKey]);

  const handleDownload = async (key: string) => {
    try {
      const r = await fetch(
        `/api/files/download-url?key=${encodeURIComponent(key)}`
      );
      if (!r.ok) {
        console.error(await r.text());
        return;
      }
      const { url } = await r.json();
      window.open(url, "_blank");
    } catch (e) {
      console.error("download error", e);
    }
  };

  const handleDelete = async (id: string, key: string) => {
    if (!confirm("Na pewno chcesz usunąć plik?")) return;
    setDeletingId(id);
    try {
      const r = await fetch("/api/files/delete-file", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, key }),
      });
      if (r.ok) {
        setFiles((prev) => prev.filter((f) => f.id !== id));
      } else {
        console.error("delete error", await r.text());
        alert("Błąd podczas usuwania");
      }
    } catch (e) {
      console.error(e);
      alert("Błąd sieci podczas usuwania");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div>Ładowanie plików...</div>;
  if (files.length === 0) return <div>Brak plików</div>;

  return (
    <div className="space-y-2">
      {files.map((f) => (
        <div
          key={f.id}
          className="flex items-center flex-col md:flex-row gap-4 justify-between bg-background-secondary p-2 rounded"
        >
          <div>
            <div className="font-medium">{f.filename}</div>
            <div className="text-xs text-gray-500">
              {f.mimetype ?? "—"} • {f.size ?? "—"} bytes
            </div>
            <div className="text-xs text-gray-400">
              Dodano: {new Date(f.createdAt).toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              className="btn"
              onClick={() => handleDownload(f.key)}
              text="Otwórz"
            />
            <Button
              variant={"destructive"}
              onClick={() => handleDelete(f.id, f.key)}
              disabled={deletingId === f.id}
              text={deletingId === f.id ? "Usuwanie..." : "Usuń"}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
