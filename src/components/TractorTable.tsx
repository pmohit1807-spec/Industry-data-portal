import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PivotedSale } from "@/utils/dataTransformation";

interface TractorTableProps {
  data: PivotedSale[];
  uniqueStates: string[];
}

const TractorTable: React.FC<TractorTableProps> = ({ data, uniqueStates }) => {
  if (data.length === 0) {
    return <p className="text-center text-muted-foreground p-8">No data matches the current filters.</p>;
  }

  // Define base columns
  const baseHeaders = ["Month", "Company", "HP Range"];
  
  // Dynamic state columns
  const stateHeaders = uniqueStates;

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {baseHeaders.map(header => (
              <TableHead key={header} className="w-[150px]">{header}</TableHead>
            ))}
            {stateHeaders.map(state => (
              <TableHead key={state} className="text-right">{state} (Units)</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((sale, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{sale.month}</TableCell>
              <TableCell>{sale.company}</TableCell>
              <TableCell>{sale.hp_range}</TableCell>
              {stateHeaders.map(state => (
                <TableCell key={state} className="text-right">
                  {(sale[state] as number)?.toLocaleString() || 0}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TractorTable;