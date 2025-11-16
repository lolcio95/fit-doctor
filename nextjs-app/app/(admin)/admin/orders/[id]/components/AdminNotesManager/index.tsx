"use client";
import React, { useEffect, useState } from "react";
import { Trash2, User, Clock, Edit2, Save, X as XIcon } from "lucide-react";

type Note = {
  id: string;
  paymentId: string;
  authorId?: string | null;
  authorName?: string | null;
  content: string;
  createdAt: string;
};

export default function AdminNotesManager({
  paymentId,
}: {
  paymentId: string;
}) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const [savingEditId, setSavingEditId] = useState<string | null>(null);

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/orders/paymentNotes?paymentId=${encodeURIComponent(paymentId)}`
      );
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setNotes(json.notes || []);
    } catch (e: any) {
      console.error("fetchNotes error", e);
      setError("Nie można pobrać notatek");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId]);

  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newContent.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/orders/paymentNotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, content: newContent.trim() }),
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setNewContent("");
      setNotes((prev) => [json.note, ...prev]);
    } catch (e) {
      console.error("create note error", e);
      alert("Błąd podczas tworzenia notatki");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Na pewno usunąć notatkę?")) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/admin/orders/paymentNotes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error(await res.text());
      setNotes((prev) => prev.filter((n) => n.id !== id));
      // if we deleted the one being edited, reset edit
      if (editingId === id) {
        setEditingId(null);
        setEditingContent("");
      }
    } catch (e) {
      console.error("delete note error", e);
      alert("Błąd podczas usuwania notatki");
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditingContent(note.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingContent("");
  };

  const saveEdit = async (id: string) => {
    const contentTrim = editingContent.trim();
    if (!contentTrim) {
      alert("Notatka nie może być pusta");
      return;
    }
    setSavingEditId(id);
    try {
      const res = await fetch("/api/admin/orders/paymentNotes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, content: contentTrim }),
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      // replace updated note in state
      setNotes((prev) => prev.map((n) => (n.id === id ? json.note : n)));
      setEditingId(null);
      setEditingContent("");
    } catch (e) {
      console.error("save edit error", e);
      alert("Błąd podczas zapisywania notatki");
    } finally {
      setSavingEditId(null);
    }
  };

  return (
    <div className="rounded-lg shadow-sm">
      <h3 className="text-sm font-medium mb-3">
        Moje notatki (widoczne tylko dla adminów)
      </h3>

      <form onSubmit={handleCreate} className="space-y-2 mb-4">
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          rows={3}
          placeholder="Dodaj notatkę (np. informacje o kontakcie, statusie, dodatkowe uwagi)..."
          className="w-full p-2 border rounded resize-none"
        />
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">{newContent.length}/2000</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setNewContent("");
              }}
              className="px-3 py-1 rounded border bg-gray-600 text-color-primary text-sm"
              disabled={creating}
            >
              Wyczyść
            </button>
            <button
              type="submit"
              className={`px-4 py-1.5 rounded text-sm bg-blue-600 text-white ${creating ? "opacity-60" : "hover:bg-blue-700"}`}
              disabled={creating || !newContent.trim()}
            >
              {creating ? "Zapisywanie..." : "Dodaj notatkę"}
            </button>
          </div>
        </div>
      </form>

      {error && <div className="text-red-600 mb-2">{error}</div>}

      {loading ? (
        <div>Ładowanie notatek...</div>
      ) : notes.length === 0 ? (
        <div className="text-sm text-gray-500">Brak notatek</div>
      ) : (
        <ul className="space-y-2">
          {notes.map((n) => (
            <li
              key={n.id}
              className="border border-background-card p-3 rounded bg-background-card"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  {editingId === n.id ? (
                    <>
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        rows={3}
                        className="w-full p-2 border rounded resize-none"
                      />
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => saveEdit(n.id)}
                          disabled={savingEditId === n.id}
                          className="px-3 py-1 rounded bg-green-600 text-white text-sm"
                        >
                          {savingEditId === n.id ? (
                            "Zapisywanie..."
                          ) : (
                            <span className="flex items-center gap-2">
                              <Save className="w-4 h-4" /> Zapisz
                            </span>
                          )}
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={savingEditId === n.id}
                          className="px-3 py-1 rounded border text-sm"
                        >
                          <span className="flex items-center gap-2">
                            <XIcon className="w-4 h-4" /> Anuluj
                          </span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-sm whitespace-pre-wrap break-words">
                        {n.content}
                      </div>
                      <div className="mt-2 text-xs text-gray-500 flex items-center gap-3">
                        <span className="inline-flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {n.authorName ?? "—"}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(n.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-start gap-2">
                  {editingId !== n.id && (
                    <>
                      <button
                        onClick={() => startEdit(n)}
                        title="Edytuj notatkę"
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(n.id)}
                        disabled={deletingId === n.id}
                        title="Usuń notatkę"
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
