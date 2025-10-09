import React from "react";
import { TableSection } from "@/components/blocks/table-section";
import { TableObject as SanityTable } from "@/sanity.types";

export interface TableProps {
  block: SanityTable;
}

export const Table = ({ block }: TableProps) => {
  const { title, table, backgroundColor } = block;

  return (
    <TableSection
      title={title}
      table={table}
      backgroundColor={backgroundColor}
    />
  );
};
