"use client";

import { useEffect, useState } from "react";

type SessionPayload = {
  success: boolean;
  message?: string;
  session?: {
    id: string;
    mode?: string;
    customer_email?: string;
    amount?: number;
    currency?: string;
    productName?: string;
  };
};

export default function CancelPage() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<SessionPayload["session"] | null>(
    null
  );
  const [message, setMessage] = useState<string | null>(
    "Wygląda na to, że proces płatności został anulowany lub nie powiódł się."
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (!sessionId) {
      setMessage("Brak identyfikatora sesji płatności.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(
          `/api/stripe-session?session_id=${encodeURIComponent(sessionId)}`
        );
        const data: SessionPayload = await res.json();
        if (res.ok) {
          setSession(data.session ?? null);
        } else {
          setMessage(data?.message ?? "Nie udało się pobrać szczegółów sesji.");
        }
      } catch (err) {
        console.error("Błąd pobierania sesji:", err);
        setMessage("Błąd sieci podczas pobierania szczegółów płatności.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="p-5 lg:p-10 flex flex-col items-center">
      <h1 className="font-bold text-xl mb-3">
        Płatność nie została zakończona
      </h1>
      <p>{message}</p>

      {loading && <p>Ładowanie szczegółów zamówienia...</p>}

      {!loading && session && (
        <section style={{ marginTop: 16 }}>
          <h2>Szczegóły (ostatnio dostępne)</h2>
          <p>
            Produkt:{" "}
            <strong>{session.productName ?? "Nieznany produkt"}</strong>
          </p>
          <p>
            Kwota:{" "}
            <strong>
              {typeof session.amount === "number"
                ? `${session.amount} ${session.currency ?? ""}`
                : "—"}
            </strong>
          </p>
          <p>
            Email: <strong>{session.customer_email ?? "—"}</strong>
          </p>
        </section>
      )}

      {!loading && !session && (
        <p style={{ marginTop: 12 }}>
          Brak szczegółów zamówienia — możliwe że sesja nie zawiera line items
          lub serwer nie miał ich jeszcze dostępnych.
        </p>
      )}
    </main>
  );
}
