"use client";
import React, { useEffect, useState } from "react";
import type { Payment } from "@prisma/client";

type Order = Payment & {
  user?: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
  } | null;
};

export default function AdminOrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   fetch("/api/admin/orders")
  //     .then((r) => {
  //       if (!r.ok) throw new Error("Fetch failed");
  //       return r.json();
  //     })
  //     .then((data) => {
  //       setOrders(data.orders ?? []);
  //     })
  //     .catch((e) => setError(String(e)))
  //     .finally(() => setLoading(false));
  // }, []);

  // async function changeStatus(id: string, newStatus: string) {
  //   // const res = await fetch(`/api/admin/orders/${id}`, {
  //   //   method: "PATCH",
  //   //   headers: { "Content-Type": "application/json" },
  //   //   body: JSON.stringify({ orderStatus: newStatus }),
  //   // });
  //   // if (!res.ok) {
  //   //   alert("Nie udało się zmienić statusu");
  //   //   return;
  //   // }
  //   // const json = await res.json();
  //   // setOrders((prev) => prev.map((o) => (o.id === id ? json.payment : o)));
  // }

  // if (loading) return <div>Ładowanie...</div>;
  // if (error) return <div>Błąd: {error}</div>;

  return <div>Order Page</div>;
}
