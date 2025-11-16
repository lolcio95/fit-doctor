"use client";
import React, { useCallback, useState } from "react";
import AdminFilesUploader from "../AdminFilesUploader";
import AdminFilesList from "../AdminFilesList";

export default function AdminFilesManager({
  paymentId,
}: {
  paymentId: string;
}) {
  const [refreshKey, setRefreshKey] = useState<number>(Date.now());

  const handleUploaded = useCallback(() => {
    setRefreshKey(Date.now());
  }, []);

  return (
    <div className="space-y-4">
      <AdminFilesUploader paymentId={paymentId} onUploaded={handleUploaded} />
      <AdminFilesList paymentId={paymentId} refreshKey={refreshKey} />
    </div>
  );
}
