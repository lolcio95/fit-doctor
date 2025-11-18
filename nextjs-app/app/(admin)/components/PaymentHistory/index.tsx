"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

type Payment = {
  id: string;
  externalId?: string | null;
  productName?: string | null;
  amount?: number | null;
  currency?: string | null;
  orderStatus?: string | null;
  createdAt: string;
};

interface Props {
  userId?: string | null;
  currentId?: string;
}

const STATUS_OPTIONS = [
  { label: "Wszystkie", value: "ALL" },
  { label: "Nieobsłużone", value: "TO_PROCESS" },
  { label: "W trakcie", value: "PROCESSING" },
  { label: "Obsłużone", value: "PROCESSED" },
];

const STATUS_LABELS: Record<string, string> = {
  TO_PROCESS: "Nieobsłużone",
  PROCESSING: "W trakcie",
  PROCESSED: "Obsłużone",
};

const STATUS_CLASSES: Record<string, string> = {
  TO_PROCESS: "bg-red-300 text-red-800",
  PROCESSING: "bg-yellow-100 text-yellow-800",
  PROCESSED: "bg-green-100 text-green-800",
};

export default function PaymentHistory({ userId, currentId }: Props) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [counts, setCounts] = useState<{
    TO_PROCESS: number;
    PROCESSING: number;
    PROCESSED: number;
  } | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchPage(p: number, status: string, replace = false) {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(p));
      if (status && status !== "ALL") params.set("status", status);
      const res = await fetch(
        `/api/admin/users/${userId}/payments?${params.toString()}`
      );
      if (!res.ok) throw new Error("Failed to fetch user payments");
      const json = await res.json();

      const fetched: Payment[] = json.payments.map((x: any) => ({
        ...x,
        createdAt: x.createdAt as string,
      }));

      if (replace) {
        setPayments(fetched);
      } else {
        setPayments((prev) => (p === 1 ? fetched : [...prev, ...fetched]));
      }

      setHasMore(Boolean(json.hasMore));
      setCounts(json.counts ?? null);
      setTotal(json.total ?? null);
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!userId) {
      setPayments([]);
      setCounts(null);
      setTotal(null);
      setHasMore(false);
      setPage(1);
      return;
    }
    setPage(1);
    fetchPage(1, statusFilter, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    setPage(1);
    setPayments([]);
    fetchPage(1, statusFilter, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const loadMore = async () => {
    if (loading || !hasMore || !userId) return;
    const next = page + 1;
    await fetchPage(next, statusFilter, false);
    setPage(next);
  };

  const renderCounts = () => {
    if (!counts) return null;
    return (
      <div className="flex items-center gap-3 text-sm mb-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-1 rounded bg-red-300 text-red-800 text-xs font-semibold">
            Nieobsłużone
          </span>
          <span className="text-sm text-color-primary">
            {counts.TO_PROCESS}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-semibold">
            W trakcie
          </span>
          <span className="text-sm text-color-primary">
            {counts.PROCESSING}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-semibold">
            Obsłużone
          </span>
          <span className="text-sm text-color-primary">{counts.PROCESSED}</span>
        </div>
        {total != null && (
          <div className="flex items-center gap-2 ml-2">
            <span className="text-xs text-color-tertiary">Razem</span>
            <span className="text-sm text-color-primary">{total}</span>
          </div>
        )}
      </div>
    );
  };

  if (!userId) {
    return (
      <div className="text-sm text-gray-500">
        Brak historii — nieznany użytkownik
      </div>
    );
  }

  return (
    // main wrapper must be flex-col and full height so parent aside's h-full works
    <div className="flex flex-col h-full">
      {/* Filter + meta */}
      <div className="mb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">{renderCounts()}</div>

          <div className="flex items-start gap-2 flex-col">
            <label htmlFor="ph-status" className="text-xs text-color-tertiary">
              Filtr
            </label>
            <select
              id="ph-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <h2 className="font-bold mb-3">Historia zakupów</h2>

      {/* Content area: takes remaining space and allows scrolling for desktop */}
      <div className="flex-1 flex flex-col">
        {/* Mobile: horizontal cards */}
        <div className="block sm:hidden mb-3">
          <div className="flex space-x-3 overflow-x-auto py-1 -mx-1">
            {payments.map((p) => {
              const isActive = p.id === currentId;
              const statusKey = p.orderStatus ?? "TO_PROCESS";
              return (
                <Link
                  key={p.id}
                  href={`/admin/orders/${p.id}`}
                  className={`min-w-[220px] shrink-0 flex flex-col justify-between border rounded-md p-3 shadow-sm hover:shadow-md ${isActive ? "ring-1 ring-blue-200 bg-background-secondary" : "bg-background-card"}`}
                >
                  <div className="text-sm font-medium truncate">
                    {p.productName ?? "Zamówienie"}
                  </div>
                  <div className="text-xs text-gray-500 truncate mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_CLASSES[statusKey]}`}
                    >
                      {STATUS_LABELS[statusKey]}
                    </span>
                  </div>
                  <div className="mt-3 text-sm font-medium">
                    {((p.amount ?? 0) / 100).toFixed(2)} {p.currency ?? ""}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(p.createdAt).toLocaleString()}
                  </div>
                </Link>
              );
            })}
            <div className="flex justify-center items-center">
              {hasMore ? (
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-3 py-4 bg-blue-600 text-white rounded text-sm w-[180px]"
                >
                  {loading ? "Ładowanie..." : "Pokaż więcej"}
                </button>
              ) : (
                <div className="text-sm text-gray-500 w-[150px]">
                  Brak więcej
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop: vertical list -> flex-1 + overflow-auto so height adapts */}
        <div className="hidden sm:block flex-1 overflow-auto">
          <ul className="space-y-2">
            {payments.map((p) => {
              const isActive = p.id === currentId;
              const statusKey = p.orderStatus ?? "TO_PROCESS";
              return (
                <li key={p.id}>
                  <Link
                    href={`/admin/orders/${p.id}`}
                    className={`flex items-center justify-between px-3 py-2 rounded-md hover:bg-background-secondary transition ${isActive ? "bg-background-primary" : "border border-transparent"}`}
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">
                        {p.productName ?? "Zamówienie"}
                      </div>
                      <div className="text-xs text-gray-500 truncate mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_CLASSES[statusKey]}`}
                        >
                          {STATUS_LABELS[statusKey]}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm">
                        {((p.amount ?? 0) / 100).toFixed(2)} {p.currency ?? ""}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(p.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
          {/* Load more / empty state area at bottom */}
          <div className="mt-3 flex-shrink-0 flex justify-center">
            {hasMore ? (
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
              >
                {loading ? "Ładowanie..." : "Pokaż więcej"}
              </button>
            ) : (
              <div className="text-sm text-gray-500">Brak więcej</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
