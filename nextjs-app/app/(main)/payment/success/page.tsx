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

export default function SuccessPage() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<
    "checking" | "success" | "pending" | "error"
  >("checking");
  const [message, setMessage] = useState<string | null>(null);
  const [session, setSession] = useState<SessionPayload["session"] | null>(
    null
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (!sessionId) {
      setMessage("Brak identyfikatora sesji płatności.");
      setStatus("error");
      setLoading(false);
      return;
    }

    let attempts = 0;
    const maxAttempts = 6;
    const delay = 1500;
    let cancelled = false;

    const check = async () => {
      attempts++;
      try {
        const res = await fetch(
          `/api/stripe-session?session_id=${encodeURIComponent(sessionId)}`
        );
        const data: SessionPayload = await res.json();

        if (!res.ok) {
          setMessage(data?.message ?? "Błąd podczas sprawdzania płatności.");
          setStatus("error");
          setLoading(false);
          return;
        }

        setSession(data.session ?? null);

        if (data.success) {
          setStatus("success");
          setMessage(data.message ?? "Płatność zakończona pomyślnie.");
          setLoading(false);
          return;
        }

        // jeśli jeszcze niepotwierdzone, ponawiamy do maxAttempts
        if (attempts < maxAttempts) {
          setTimeout(() => {
            if (!cancelled) check();
          }, delay);
          return;
        }

        // wyczerpane próby — traktujemy jako pending
        setStatus("pending");
        setMessage(
          data.message ?? "Płatność nie została jeszcze potwierdzona."
        );
        setLoading(false);
      } catch (err) {
        console.error("Błąd sieci podczas sprawdzania sesji:", err);
        if (attempts < maxAttempts) {
          setTimeout(() => {
            if (!cancelled) check();
          }, delay);
          return;
        }
        setStatus("error");
        setMessage("Błąd sieci podczas sprawdzania statusu płatności.");
        setLoading(false);
      }
    };

    check();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="p-5 lg:p-10 flex flex-col items-center">
      <h1 className="font-bold text-xl mb-3">Dziękujemy za zakup</h1>

      {loading && <p>Sprawdzam status płatności...</p>}

      {!loading && status === "success" && (
        <>
          <p className="text-color-secondary font-bold mb-2">{message} 🎉</p>
          <p>Wkrótce się z Tobą skontaktujemy </p>
          {session ? (
            <section style={{ marginTop: 16 }}>
              <h2 className="text-lg font-bold">Szczegóły zamówienia:</h2>
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
          ) : (
            <p>Brak szczegółów zamówienia.</p>
          )}
        </>
      )}

      {!loading && status === "pending" && (
        <>
          <p style={{ color: "#b8860b", fontWeight: 600 }}>{message}</p>
          {session ? (
            <section style={{ marginTop: 16 }}>
              <h2 className="text-lg font-bold">Szczegóły zamówienia:</h2>
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
          ) : null}
          <p style={{ marginTop: 12 }}>
            Finalizacja zamówienia trwa — otrzymasz potwierdzenie e‑mailem gdy
            wszystko zostanie przetworzone.
          </p>
        </>
      )}

      {!loading && status === "error" && (
        <>
          <p style={{ color: "crimson", fontWeight: 600 }}>{message}</p>
          {session ? (
            <section style={{ marginTop: 16 }}>
              <h2>Szczegóły zamówienia</h2>
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
          ) : null}
          <p style={{ marginTop: 12 }}>
            Jeśli problem będzie się utrzymywać, skontaktuj się z obsługą.
          </p>
        </>
      )}
    </main>
  );
}
