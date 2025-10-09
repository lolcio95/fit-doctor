import React, { FC } from "react";
import { Table as SanityTable } from "@/sanity.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RichTextTableProps {
  table: SanityTable;
}

const RichTextTable: FC<RichTextTableProps> = ({ table }) => {
  const { rows } = table || {};
  const [headerRow, ...dataRows] = rows ?? [];

  if (!rows?.length) {
    return null;
  }

  return (
    <div className="bg-background w-full rounded-xl p-6">
      <div className="overflow-x-auto">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow>
              {headerRow?.cells?.map((cell, idx) => (
                <TableHead
                  className="text-sm font-bold whitespace-normal"
                  key={idx}
                >
                  {cell}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataRows.map(({ _key, cells }) => (
              <TableRow key={_key}>
                {cells?.map((cell, idx) => (
                  <TableCell key={idx}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RichTextTable;
