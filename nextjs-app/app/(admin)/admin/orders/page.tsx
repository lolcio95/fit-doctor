"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/app/components/molecules/Select";

type OrderUser = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
};
type Order = {
  id: string;
  externalId?: string | null;
  productName?: string | null;
  paymentType?: string | null;
  amount?: number | null;
  currency?: string | null;
  orderStatus?: string | null;
  createdAt: string;
  user?: OrderUser | null;
};

const STATUS_LABELS: Record<string, string> = {
  TO_PROCESS: "Nieobsłużony",
  PROCESSING: "W trakcie",
  PROCESSED: "Obsłużony",
};

const STATUS_CLASSES: Record<string, string> = {
  TO_PROCESS: "bg-red-300 text-red-800 font-semibold",
  PROCESSING: "bg-yellow-100 text-yellow-800 font-semibold",
  PROCESSED: "bg-green-100 text-green-800 font-semibold",
};

const SELECT_OPTIONS = [
  { label: "Wszystkie", value: "ALL" },
  { label: "Nieobsłużone", value: "TO_PROCESS" },
  { label: "W trakcie", value: "PROCESSING" },
  { label: "Obsłużone", value: "PROCESSED" },
];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  async function fetchPage(p: number, status: string) {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(p));
      if (status && status !== "ALL") params.set("status", status);
      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const json = await res.json();
      const fetched: Order[] = json.orders.map((o: any) => ({
        ...o,
        createdAt:
          (o.createdAt && new Date(o.createdAt).toISOString()) ||
          new Date().toISOString(),
      }));
      if (p === 1) {
        setOrders(fetched);
      } else {
        setOrders((prev) => [...prev, ...fetched]);
      }
      setHasMore(Boolean(json.hasMore));
    } catch (e: any) {
      setError(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // initial load
    setPage(1);
    fetchPage(1, statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When status changes, reset list and load first page with filter
  useEffect(() => {
    setPage(1);
    setOrders([]);
    fetchPage(1, statusFilter);
  }, [statusFilter]);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    const next = page + 1;
    await fetchPage(next, statusFilter);
    setPage(next);
  };

  const goToOrder = (id: string) => {
    router.push(`/admin/orders/${id}`);
  };

  function formatDate(iso?: string) {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  }

  function formatAmount(amount?: number | null, currency?: string | null) {
    if (amount == null) return "-";
    const value = (amount / 100).toFixed(2);
    return `${value} ${currency ?? ""}`.trim();
  }

  // Helper to get placeholder label for the controlled Select.
  // We pass placeholder and a changing `key` so the Select internals reinitialize when filter changes.
  const currentPlaceholder =
    statusFilter === "ALL"
      ? "Wszystkie"
      : (STATUS_LABELS[statusFilter] ?? "Wszystkie");

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h1 className="text-2xl font-semibold">Zamówienia</h1>

        <div className="flex items-center gap-2 justify-end">
          <label htmlFor="status" className="text-sm text-white">
            Filtruj:
          </label>

          <div className="w-[14.375rem] flex justify-end">
            <Select
              key={statusFilter}
              value={statusFilter}
              placeholder={currentPlaceholder}
              options={SELECT_OPTIONS}
              onChange={setStatusFilter}
            />
          </div>
        </div>
      </div>

      {error && <div className="text-red-600 mb-4">Błąd: {error}</div>}

      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-3 py-2 text-left">Produkt</th>
              <th className="border px-3 py-2 text-right">Kwota</th>
              <th className="border px-3 py-2 text-left">Użytkownik</th>
              <th className="border px-3 py-2 text-left">Status</th>
              <th className="border px-3 py-2 text-left">Utworzono</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr
                key={o.id}
                className="hover:bg-gray-600 cursor-pointer"
                onClick={() => goToOrder(o.id)}
              >
                <td className="border px-3 py-2">
                  <div>{o.productName ?? "-"}</div>
                  <div className="text-gray-400 text-sm">
                    <span className="font-bold">Typ płatności: </span>
                    {o.paymentType === "one-time"
                      ? "Płatność jednorazowa"
                      : "Subskrypcja"}
                  </div>
                </td>
                <td className="border px-3 py-2 text-right">
                  {formatAmount(o.amount, o.currency)}
                </td>
                <td className="border px-3 py-2">
                  <div className="w-full h-full flex flex-col max-w-[230px]">
                    <div className="font-bold text-sm whitespace-normal break-words">
                      {o.user?.name}
                    </div>
                    <div className=" text-sm whitespace-normal break-words">
                      {o.user?.email}
                    </div>
                  </div>
                </td>
                <td className="border px-3 py-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-sm ${STATUS_CLASSES[o.orderStatus ?? "TO_PROCESS"]}`}
                  >
                    {STATUS_LABELS[o.orderStatus ?? "TO_PROCESS"]}
                  </span>
                </td>
                <td className="border px-3 py-2">{formatDate(o.createdAt)}</td>
              </tr>
            ))}
            {orders.length === 0 && !loading && (
              <tr>
                <td className="border px-3 py-2" colSpan={5}>
                  Brak zamówień
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile/card view */}
      <div className="sm:hidden space-y-3">
        {orders.map((o) => (
          <article
            key={o.id}
            role="button"
            tabIndex={0}
            onClick={() => goToOrder(o.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter") goToOrder(o.id);
            }}
            className="border rounded-lg p-3 shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-base font-medium">
                  {o.productName ?? "-"}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  <div className="text-color-tertiary whitespace-normal break-words">
                    {o.user?.name}
                  </div>
                  <div className="whitespace-normal break-words">
                    {o.user?.email ?? "-"}
                  </div>
                </div>
              </div>
              <div className="ml-3 text-right">
                <div className="text-sm text-gray-700">
                  {formatAmount(o.amount, o.currency)}
                </div>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs ${STATUS_CLASSES[o.orderStatus ?? "TO_PROCESS"]}`}
                  >
                    {STATUS_LABELS[o.orderStatus ?? "TO_PROCESS"]}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500 flex justify-between items-center">
              <div>Utworzono: {formatDate(o.createdAt)}</div>
              <div className="text-gray-400 text-xs">
                {o.externalId ? o.externalId.slice(0, 12) : o.id.slice(0, 8)}
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500 flex justify-between items-center">
              <div>
                <span className="font-bold">Typ płatności: </span>
                {o.paymentType === "one-time"
                  ? "Płatność jednorazowa"
                  : "Subskrypcja"}
              </div>
            </div>
          </article>
        ))}

        {orders.length === 0 && !loading && (
          <div className="text-center text-gray-500">Brak zamówień</div>
        )}
      </div>

      <div className="mt-4 flex justify-center">
        {hasMore ? (
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Ładowanie..." : "Pokaż więcej"}
          </button>
        ) : (
          <div className="text-sm text-gray-500">Brak więcej zamówień</div>
        )}
      </div>
    </div>
  );
}
