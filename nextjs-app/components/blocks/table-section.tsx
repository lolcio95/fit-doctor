"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check } from "lucide-react";
import { TableObject as SanityTable } from "@/sanity.types";
import SectionWrapper from "@/app/components/molecules/SectionWrapper";

interface TableSectionProps extends Omit<SanityTable, "_type"> {}

export function TableSection({
  table,
  title,
  backgroundColor,
}: TableSectionProps) {
  const { rows } = table || {};
  const [headerRow, ...dataRows] = rows ?? [];

  return (
    <SectionWrapper
      backgroundColor={backgroundColor}
      className="py-16 md:py-24"
      defaultBgClassName="bg-muted"
    >
      <div className="container mx-auto flex flex-col items-center gap-10 px-6 md:gap-12">
        {title && (
          <h2 className="text-center text-3xl font-bold md:text-4xl">
            {title}
          </h2>
        )}
        {!!rows?.length && (
          <div className="bg-background w-full rounded-xl p-6">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <Table className="w-full table-fixed">
                  <TableHeader>
                    <TableRow>
                      {headerRow?.cells?.map((cell, idx) => (
                        <TableHead
                          className="h-12 w-[16.67%] text-sm font-bold whitespace-normal"
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
                          <TableCell className="h-12 font-semibold" key={idx}>
                            {cell === "+" ? (
                              <Check className="h-6 w-6 text-green-500" />
                            ) : (
                              cell
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
