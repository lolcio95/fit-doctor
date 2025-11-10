import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import NextImage from "next/image";
import PaymentHistory from "../../../components/PaymentHistory";
import PaymentStatusSelect from "../../../components/PaymentStatusSelect";

type Props = {
  params: Promise<any> | undefined;
};

export default async function OrderDetailsPage({ params }: Props) {
  const { id } = await params;

  // Pobierz główny payment i dołączonego usera (bez pobierania historii)
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
  });

  if (!payment) {
    return <div className="p-6">Zamówienie nie znalezione</div>;
  }

  return (
    <div className="sm:p-6 w-full mx-auto">
      <nav className="mb-4">
        <Link
          href="/admin/orders"
          className="text-md text-blue-500 font-bold hover:underline"
        >
          ← Powrót do listy zamówień
        </Link>
      </nav>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: user card */}
        <aside className="col-span-2 xl:col-span-1 bg-background-card p-4 rounded-lg shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-muted-foreground/10">
              <NextImage
                src={payment.user?.image ?? "/assets/user-img-placeholder.jpg"}
                alt={payment.user?.name ?? payment.user?.email ?? "User"}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="text-center">
              <div className="text-lg font-semibold">
                {payment.user?.name ?? "—"}
              </div>
              <div className="text-sm text-gray-500 break-words">
                {payment.user?.email ?? "—"}
              </div>
            </div>
          </div>

          <div className="mt-6">
            {/* Przekazujemy tylko userId - PaymentHistory sam pobierze dane */}
            <PaymentHistory
              userId={payment.user?.id ?? null}
              currentId={payment.id}
            />
          </div>
        </aside>

        {/* Right: payment details */}
        <div className="col-span-2 space-y-4">
          <div className="bg-background-card p-4 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold truncate whitespace-normal break-words">
                  {payment.productName ?? "Zamówienie"}{" "}
                </h2>
                <div className="text-sm text-gray-600 mt-1">
                  {new Date(payment.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="flex-shrink-0 w-full sm:w-auto flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Kwota</div>
                  <div className="text-lg font-medium">
                    {((payment.amount ?? 0) / 100).toFixed(2)}{" "}
                    {payment.currency ?? ""}
                  </div>
                </div>

                <div className="w-40 sm:w-auto">
                  <PaymentStatusSelect
                    initialStatus={payment.orderStatus ?? "TO_PROCESS"}
                    paymentId={payment.id}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium">Szczegóły</h3>
              <pre className="mt-2 text-xs bg-gray-50 p-2 rounded text-gray-700 overflow-auto max-h-48">
                {JSON.stringify(payment, null, 2)}
              </pre>
            </div>
          </div>

          <div className="bg-background-card p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium mb-2">Dodatkowe informacje</h3>
            <div className="text-sm text-gray-600">
              Tutaj możesz dodać logi, notatki lub akcje powiązane z paymentem.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
