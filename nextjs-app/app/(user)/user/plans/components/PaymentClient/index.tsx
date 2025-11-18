"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type FileRec = {
  id: string;
  key: string;
  filename: string;
  mimetype?: string | null;
  size?: number | null;
  createdAt: string;
  url?: string | null;
};

type PaymentRec = {
  id: string;
  productName?: string | null;
  paymentType?: string | null;
  amount?: number | null;
  currency?: string | null;
  orderStatus?: string | null;
  createdAt: string;
  files?: FileRec[];
};

const STATUS_LABELS: Record<string, string> = {
  TO_PROCESS: "Przyjęty",
  PROCESSING: "W trakcie",
  PROCESSED: "Obsłużony",
};

const STATUS_CLASSES: Record<string, string> = {
  TO_PROCESS: "bg-yellow-100 text-yellow-800 font-medium",
  PROCESSING: "bg-blue-100 text-blue-800 font-medium",
  PROCESSED: "bg-green-100 text-green-800 font-medium",
};

function formatAmount(amount?: number | null, currency?: string | null) {
  if (amount == null) return "-";
  const value = (amount / 100).toFixed(2);
  return `${value} ${currency ?? ""}`.trim();
}

export default function PaymentsClient({
  initialPageSize = 10,
}: {
  initialPageSize?: number;
}) {
  const [payments, setPayments] = useState<PaymentRec[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/user/plans?page=${p}&pageSize=${pageSize}`,
        { cache: "no-store" }
      );
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }
      const json = await res.json();
      if (p === 1) {
        setPayments(json.payments || []);
      } else {
        setPayments((prev) => [...prev, ...(json.payments || [])]);
      }
      setHasMore(Boolean(json.hasMore));
      setPage(json.page || p);
    } catch (e: any) {
      console.error("fetchPage error", e);
      setError("Nie można pobrać zamówień");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial load
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    await fetchPage(page + 1);
  };

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!payments.length && !loading) {
    return (
      <div className="p-6 text-gray-500">Nie znaleziono żadnych zamówień.</div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {payments.map((payment) => (
        <div
          key={payment.id}
          className="rounded-lg p-4 bg-background-card shadow-sm"
        >
          <div className="flex flex-col md:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-medium">
                {payment.productName ?? "Zamówienie"}
              </h2>
              <div className="text-sm text-gray-500 mt-1">
                Utworzone:{" "}
                {payment.createdAt
                  ? new Date(payment.createdAt).toLocaleString()
                  : "—"}
              </div>
            </div>

            <div className="flex 1 items-center gap-4">
              <div
                className={`px-2 py-1 rounded text-sm ${STATUS_CLASSES[payment.orderStatus ?? "TO_PROCESS"]}`}
              >
                {STATUS_LABELS[payment.orderStatus ?? "TO_PROCESS"]}
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500">Metoda płatności</div>
                <div className="font-medium text-sm">
                  {payment.paymentType === "one-time"
                    ? "Płatność jednorazowa"
                    : "Subskrypcja"}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500">Kwota</div>
                <div className="font-medium">
                  {formatAmount(payment.amount, payment.currency)}
                </div>
              </div>
            </div>
          </div>
          {payment.orderStatus === "TO_PROCESS" && (
            <div className="mt-3">
              <p className="text-yellow-300 text-sm">
                Twoje zamówienie zostało przez nas przyjęte i wkrótce zostanie
                ono obsłużone.
              </p>
            </div>
          )}
          {payment.orderStatus === "PROCESSING" && (
            <div className="mt-3">
              <p className="text-blue-300 text-sm">
                Twoje zamówienie jest w trakcie realizacji.
              </p>
            </div>
          )}
          {payment.orderStatus === "PROCESSED" && (
            <div className="mt-3">
              <p className="text-green-300 text-sm">
                Twoje zamówienie zostało obsłużone.
              </p>
            </div>
          )}

          {/* Files */}
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Pliki do pobrania:</h3>
            {payment.files && payment.files.length > 0 ? (
              <ul className="space-y-2">
                {payment.files.map((f) => (
                  <li
                    key={f.id}
                    className="flex items-center justify-between bg-background-secondary p-2 rounded"
                  >
                    <div>
                      <div className="font-medium">{f.filename}</div>
                      <div className="text-xs text-gray-500">
                        {f.mimetype ?? "—"} • {f.size ?? "—"} bytes
                      </div>
                    </div>
                    <div>
                      {f.url ? (
                        <Link
                          href={f.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
                        >
                          Otwórz
                        </Link>
                      ) : (
                        <span className="text-xs text-gray-500">
                          Błąd generowania linku
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-500">
                Brak plików przypisanych do tego zamówienia.
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="flex justify-center mt-4">
        {hasMore ? (
          <Button
            onClick={loadMore}
            disabled={loading}
            // className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Ładowanie..." : "Pokaż więcej"}
          </Button>
        ) : (
          <div className="text-sm text-gray-500">Brak więcej zamówień</div>
        )}
      </div>
    </div>
  );
}
